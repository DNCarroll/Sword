// Guids.cs
// MUST match guids.h
using System;

namespace Cearbhall.Sword_Extension
{
    static class GuidList
    {
        public const string guidSword_ExtensionPkgString = "579bc54a-de13-43f9-a4ab-bdced44daa99";
        public const string guidSword_ExtensionCmdSetString = "48fad25e-a41c-4d50-8d15-6d612387cff6";

        public static readonly Guid guidSword_ExtensionCmdSet = new Guid(guidSword_ExtensionCmdSetString);
    };
}