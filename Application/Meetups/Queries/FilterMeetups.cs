using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Application.Validators;
using Persistence;

namespace Application.Meetups.Queries
{
    public class FilterMeetupsQuery
    {
        public List<string>? Categories { get; set; }
        public List<string>? Cities { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IncludeCancelled { get; set; } = false;
        public bool? OnlyUpcoming { get; set; } = true;
        public bool? OnlyPast { get; set; } = false;
        public string? SortBy { get; set; } = "date";
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;

        // Helper properties
        public bool HasDateFilter => FromDate.HasValue || ToDate.HasValue;
        public bool HasCategoryFilter => Categories != null && Categories.Any();
        public bool HasCityFilter => Cities != null && Cities.Any();
        public bool HasAnyFilter => HasDateFilter || HasCategoryFilter || HasCityFilter || OnlyPast == true;
    }

    public class FilterMeetupsHandler
    {
        private readonly AppDbContext _context;
        private readonly ILogger<FilterMeetupsHandler> _logger;

        public FilterMeetupsHandler(AppDbContext context, ILogger<FilterMeetupsHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<FilterMeetupsResult>> Handle(FilterMeetupsQuery query)
        {
            try
            {
                _logger.LogInformation("Filtering meetups with parameters: {@Parameters}", query);

                // Validácia
                if (query.PageSize > 100) return (Result<FilterMeetupsResult>)Result.Failure("Page size cannot exceed 100");
                if (query.PageSize <= 0) return (Result<FilterMeetupsResult>)Result.Failure("Page size must be at least 1");
                if (query.OnlyUpcoming == true && query.OnlyPast == true) 
                    return (Result<FilterMeetupsResult>)Result.Failure("Cannot filter for both upcoming and past meetups simultaneously");

                var meetupsQuery = _context.Meetups.AsQueryable();
                meetupsQuery = ApplyFilters(meetupsQuery, query);

                var totalCount = await meetupsQuery.CountAsync();
                meetupsQuery = ApplySorting(meetupsQuery, query.SortBy, query.SortDescending);

                var meetups = await meetupsQuery
                    .Skip((query.PageNumber - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .ToListAsync();

                var facets = await GetFacetData(query);

                var result = new FilterMeetupsResult
                {
                    Meetups = meetups,
                    TotalCount = totalCount,
                    PageNumber = query.PageNumber,
                    PageSize = query.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize),
                    Facets = facets
                };

                _logger.LogInformation("Filtered {Count} meetups with {Total} total", meetups.Count, totalCount);
                return Result<FilterMeetupsResult>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error filtering meetups");
                return (Result<FilterMeetupsResult>)Result.Failure("An error occurred while filtering meetups");
            }
        }

        private static IQueryable<Meetup> ApplyFilters(IQueryable<Meetup> query, FilterMeetupsQuery filter)
        {
            if (filter.HasCategoryFilter) query = query.Where(m => filter.Categories!.Contains(m.Category));
            if (filter.HasCityFilter) query = query.Where(m => filter.Cities!.Contains(m.City));
            if (filter.FromDate.HasValue) query = query.Where(m => m.Date >= filter.FromDate.Value);
            if (filter.ToDate.HasValue) query = query.Where(m => m.Date <= filter.ToDate.Value);
            if (filter.OnlyUpcoming == true) query = query.Where(m => m.Date >= DateTime.UtcNow && !m.IsCancelled);
            if (filter.OnlyPast == true) query = query.Where(m => m.Date < DateTime.UtcNow);
            if (!filter.IncludeCancelled.GetValueOrDefault()) query = query.Where(m => !m.IsCancelled);
            return query;
        }

        private IQueryable<Meetup> ApplySorting(IQueryable<Meetup> query, string sortBy, bool descending)
        {
            return (sortBy?.ToLower(), descending) switch
            {
                ("title", true) => query.OrderByDescending(m => m.Title),
                ("title", false) => query.OrderBy(m => m.Title),
                ("city", true) => query.OrderByDescending(m => m.City),
                ("city", false) => query.OrderBy(m => m.City),
                ("category", true) => query.OrderByDescending(m => m.Category),
                ("category", false) => query.OrderBy(m => m.Category),
                (_, true) => query.OrderByDescending(m => m.Date),
                _ => query.OrderBy(m => m.Date)
            };
        }

        private async Task<FacetData> GetFacetData(FilterMeetupsQuery query)
        {
            var baseQuery = _context.Meetups.AsQueryable();
            if (query.FromDate.HasValue) baseQuery = baseQuery.Where(m => m.Date >= query.FromDate.Value);
            if (query.ToDate.HasValue) baseQuery = baseQuery.Where(m => m.Date <= query.ToDate.Value);
            if (query.OnlyUpcoming == true) baseQuery = baseQuery.Where(m => m.Date >= DateTime.UtcNow && !m.IsCancelled);
            if (query.OnlyPast == true) baseQuery = baseQuery.Where(m => m.Date < DateTime.UtcNow);
            if (!query.IncludeCancelled.GetValueOrDefault()) baseQuery = baseQuery.Where(m => !m.IsCancelled);

            var categories = await baseQuery
                .Where(m => !query.HasCategoryFilter || !query.Categories!.Contains(m.Category))
                .GroupBy(m => m.Category)
                .Select(g => new FacetItem { Value = g.Key, Count = g.Count() })
                .OrderByDescending(f => f.Count)
                .ThenBy(f => f.Value)
                .ToListAsync();

            var cities = await baseQuery
                .Where(m => !query.HasCityFilter || !query.Cities!.Contains(m.City))
                .GroupBy(m => m.City)
                .Select(g => new FacetItem { Value = g.Key, Count = g.Count() })
                .OrderByDescending(f => f.Count)
                .ThenBy(f => f.Value)
                .ToListAsync();

            var dates = await baseQuery.Select(m => m.Date).ToListAsync();

            return new FacetData
            {
                Categories = categories,
                Cities = cities,
                DateRange = dates.Any() ? new DateRangeFacet { MinDate = dates.Min(), MaxDate = dates.Max() } : null
            };
        }
    }

    public class FilterMeetupsResult
    {
        public List<Meetup> Meetups { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public FacetData Facets { get; set; } = new();
    }

    public class FacetData
    {
        public List<FacetItem> Categories { get; set; } = new();
        public List<FacetItem> Cities { get; set; } = new();
        public DateRangeFacet? DateRange { get; set; }
    }

    public class FacetItem
    {
        public string Value { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class DateRangeFacet
    {
        public DateTime MinDate { get; set; }
        public DateTime MaxDate { get; set; }
    }
}