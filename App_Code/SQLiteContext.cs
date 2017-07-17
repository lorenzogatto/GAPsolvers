using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

/// <summary>
/// A connection to the SQLite DB.
/// </summary>
public class SQLiteContext : DbContext
{
    private static bool _created = true;
    public SQLiteContext()
    {
        if (!_created)
        {
            _created = true;
            Database.EnsureDeleted();
            Database.EnsureCreated();
            Add5Instances.Main();
        }
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionbuilder)
    {
        ConnectionStringSettings connString = ConfigurationManager.ConnectionStrings["SQLiteConn"];
        optionbuilder.UseSqlite(connString.ConnectionString);
    }

    public DbSet<GAPInstance> GAPInstances { get; set; }
    public DbSet<GAPSolution> GAPSolutions { get; set; }
}