using Mapster;
using Domain;

namespace Application.Core
{
    public static class MappingConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<Meetup, Meetup>.NewConfig();
        }
    }
}
