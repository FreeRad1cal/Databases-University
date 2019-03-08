namespace Helpers.Patterns.ChainOfResponsibility
{
    public class NullChainOfResponsibilityHandler<TRequest, TReturn> : ChainOfResponsibilityHandler<TRequest, TReturn>
    {
        private readonly TReturn _defaultValue;

        public NullChainOfResponsibilityHandler(TReturn defaultValue = default)
        {
            _defaultValue = defaultValue;
        }

        public override TReturn Handle(TRequest request) => _defaultValue;
    }
}
