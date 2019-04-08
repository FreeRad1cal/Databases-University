namespace Personnel.Domain.AggregateModel.EmployeeAggregate
{
    public class Title
    {
        public string Name { get; }

        public Title(string name)
        {
            Name = name;
        }
    }
}
