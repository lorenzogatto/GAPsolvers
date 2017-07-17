using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// This class has a main method that adds 5 instances to the SQLite DB
/// </summary>
public class Add5Instances
{
    public static void Main()
    {
        using (SQLiteContext ctx = new SQLiteContext())
        {
            ctx.GAPInstances.Add(InstanceBuilder.createNewInstance(10, 10));
            ctx.GAPInstances.Add(InstanceBuilder.createNewInstance(10, 20));
            ctx.GAPInstances.Add(InstanceBuilder.createNewInstance(25, 50));
            ctx.GAPInstances.Add(InstanceBuilder.createNewInstance(25, 50));
            ctx.GAPInstances.Add(InstanceBuilder.createNewInstance(50, 100));
            ctx.SaveChanges();
        }
    }
}