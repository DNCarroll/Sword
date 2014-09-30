using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Sword;
using System.Collections.Generic;
namespace Sword.Test
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {

            var t1 = new TestList<string>();
            var t2 = new TestList<string>();
            t1 = t1 + "asdf";
            t1 = t1 + "antoher" + "another2";
            t1 += "fourth";
            t1 += new string[] { "one", "two" };
            t1 = t1 + t2;
            t1 -= (q) => q == "one";             
            Assert.IsTrue(t1 > 2);
            Assert.IsTrue(t1 == 4);
        }
    }
}
