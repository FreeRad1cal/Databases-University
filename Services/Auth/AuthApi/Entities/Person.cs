namespace AuthApi.Entities
{
    public class Person
    {
        public string Id { get; set; }

        public string PasswordHash { get; set; }

        public string PasswordSalt { get; set; }
    }
}
