using SecureChat.Common.Events.EventBus.Events;

namespace AuthApi.IntegrationEvents.Events
{
    public class PersonRegisteredIntegrationEvent : IntegrationEvent
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public int Id { get; set; }

        public PersonRegisteredIntegrationEvent(int id, string password, string userName)
        {
            Id = id;
            Password = password;
            UserName = userName;
        }
    }
}
