using System.Threading.Tasks;

namespace DatabasesUniversity.Common.Events.EventBus.Abstractions
{
    public interface IDynamicIntegrationEventHandler
    {
        Task Handle(dynamic eventData);
    }
}
