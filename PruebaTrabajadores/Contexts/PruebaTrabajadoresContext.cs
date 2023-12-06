using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PruebaTrabajadores.Models;
using System;

namespace PruebaTrabajadores.Contexts
{
    public class PruebaTrabajadoresContext : DbContext
    {
        public PruebaTrabajadoresContext(DbContextOptions<PruebaTrabajadoresContext> options) : base(options)
        {

        }

       
        public DbSet<ListarTrabajadoresSPResult> ListarTrabajadoresSPResult {  get; set; }
     
        public DbSet<Trabajador> Trabajadores { get; set; }
        public DbSet<Departamento> Departamento { get; set;}
        public DbSet<Provincia> Provincia { get; set;}
        public DbSet<Distrito> Distrito { get; set;}   
    }
}
