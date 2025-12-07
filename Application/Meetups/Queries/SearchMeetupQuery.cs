using Domain;
using Microsoft.EntityFrameworkCore;
using Application.Validators;
using Persistence;
using Microsoft.Extensions.Logging;

namespace Application.Meetups.Queries
{
    public class SearchMeetupsQuery
    {
        public string? SearchTerm { get; set; }
        public string? Category { get; set; }
        public string? City { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool? IncludeCancelled { get; set; } = false;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public double? RadiusInKm { get; set; }
        public string? SortBy { get; set; } = "date";
        public bool SortDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class SearchMeetupsHandler
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SearchMeetupsHandler> _logger;

        public SearchMeetupsHandler(
            AppDbContext context,
            ILogger<SearchMeetupsHandler> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Result<SearchMeetupsResult>> Handle(SearchMeetupsQuery query)
        {
            try
            {
                _logger.LogInformation("Searching meetups with filters: {@Filters}", query);

                // Validácia
                if (query.PageSize > 100)
                {
                    return (Result<SearchMeetupsResult>)Result.Failure("Page size cannot exceed 100");
                }

                if (query.PageSize <= 0)
                {
                    return (Result<SearchMeetupsResult>)Result.Failure("Page size must be at least 1");
                }

                var meetupsQuery = _context.Meetups.AsQueryable();

                // Apply filters
                meetupsQuery = ApplyFilters(meetupsQuery, query);

                // Get total count before sorting and pagination
                var totalCount = await meetupsQuery.CountAsync();

                // Apply sorting
                meetupsQuery = ApplySorting(meetupsQuery, query.SortBy, query.SortDescending);

                // Apply pagination
                var meetups = await ApplyPagination(meetupsQuery, query.PageNumber, query.PageSize)
                    .ToListAsync();

                var searchResult = new SearchMeetupsResult
                {
                    Meetups = meetups,
                    TotalCount = totalCount,
                    PageNumber = query.PageNumber,
                    PageSize = query.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
                };

                return Result.Success(searchResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching meetups");
                return (Result<SearchMeetupsResult>)Result.Failure("An error occurred while searching meetups");
            }
        }

        private IQueryable<Meetup> ApplyFilters(IQueryable<Meetup> query, SearchMeetupsQuery searchQuery)
        {
            // Textový search
            if (!string.IsNullOrWhiteSpace(searchQuery.SearchTerm))
            {
                var searchTerm = searchQuery.SearchTerm.ToLower();
                query = query.Where(m =>
                    m.Title.ToLower().Contains(searchTerm) ||
                    m.Description.ToLower().Contains(searchTerm) ||
                    m.Venue.ToLower().Contains(searchTerm));
            }

            // Filter podľa kategórie
            if (!string.IsNullOrWhiteSpace(searchQuery.Category))
            {
                query = query.Where(m => m.Category == searchQuery.Category);
            }

            // Filter podľa mesta
            if (!string.IsNullOrWhiteSpace(searchQuery.City))
            {
                query = query.Where(m => m.City == searchQuery.City);
            }

            // Filter podľa dátumu
            if (searchQuery.FromDate.HasValue)
            {
                query = query.Where(m => m.Date >= searchQuery.FromDate.Value);
            }

            if (searchQuery.ToDate.HasValue)
            {
                query = query.Where(m => m.Date <= searchQuery.ToDate.Value);
            }

            // Filter zrušených meetupov
            if (!searchQuery.IncludeCancelled.GetValueOrDefault())
            {
                query = query.Where(m => !m.IsCancelled);
            }

            // Geografický filter
            if (searchQuery.Latitude.HasValue && 
                searchQuery.Longitude.HasValue && 
                searchQuery.RadiusInKm.HasValue)
            {
                query = query.Where(m =>
                    CalculateDistance(
                        searchQuery.Latitude.Value, 
                        searchQuery.Longitude.Value, 
                        m.Latitude, 
                        m.Longitude) <= searchQuery.RadiusInKm.Value);
            }

            return query;
        }

        private IQueryable<Meetup> ApplySorting(IQueryable<Meetup> query, string sortBy, bool sortDescending)
        {
            return sortBy.ToLower() switch
            {
                "title" => sortDescending 
                    ? query.OrderByDescending(m => m.Title)
                    : query.OrderBy(m => m.Title),
                "city" => sortDescending
                    ? query.OrderByDescending(m => m.City)
                    : query.OrderBy(m => m.City),
                "category" => sortDescending
                    ? query.OrderByDescending(m => m.Category)
                    : query.OrderBy(m => m.Category),
                "date" => sortDescending
                    ? query.OrderByDescending(m => m.Date)
                    : query.OrderBy(m => m.Date),
                _ => sortDescending
                    ? query.OrderByDescending(m => m.Date)
                    : query.OrderBy(m => m.Date)
            };
        }

        private IQueryable<Meetup> ApplyPagination(IQueryable<Meetup> query, int pageNumber, int pageSize)
        {
            return query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize);
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // Earth's radius in kilometers
            
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            
            return R * c;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }
    }

    public class SearchMeetupsResult
    {
        public List<Meetup> Meetups { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}