using System;
using System.Collections.Generic;
using System.Linq;

namespace Helpers.Extensions
{
    public static class TypeExtensions
    {
        public static bool ImplementsGenericInterface(this Type type, Type interfaceToCheck, bool includeInherited = true)
            => type.GetInterfaces(includeInherited)
                .Any(x => x.IsGenericType && x.GetGenericTypeDefinition() == interfaceToCheck);

        public static IEnumerable<Type> GetInterfaces(this Type type, bool includeInherited)
            => type.GetInterfaces()
                .Except(!includeInherited && type.BaseType != null ? type.BaseType?.GetInterfaces() : Enumerable.Empty<Type>());
    }
}
