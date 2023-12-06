using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTrabajadores.Contexts;
using PruebaTrabajadores.Models;

namespace PruebaTrabajadores.Controllers
{
    public class TrabajadorController : Controller
    {

        private readonly PruebaTrabajadoresContext _context;

        public TrabajadorController(PruebaTrabajadoresContext context)
        {
            _context = context;
        }

       
        public IActionResult Index()
        {
            return View();
        }




        [HttpGet]
        public IActionResult ListadoTrabajadores()
        {
            var trabajadores = _context.ListarTrabajadoresSPResult.FromSqlRaw("exec sp_listarTrabajadores").ToList();
            return Json(trabajadores);
        }


        [HttpGet]
        public IActionResult BuscarTrabajador(int id)
        {
            var trabajador = _context.Trabajadores.Find(id);
            return Json(trabajador);
        }


        [HttpPost]
        public IActionResult GuardarTrabajador([FromBody] Trabajador trabajador)
        {
            int salida = 0;
            try
            {
                _context.Trabajadores.Add(trabajador);
                salida = _context.SaveChanges();
            }catch(Exception ex)
            {
                salida = 0;
            }
            return Json(salida);
        }


        [HttpPut]
        public IActionResult ActualizarTrabajador([FromBody] Trabajador trabajador)
        {
            int salida = 0;
            try
            {
                var buscarTrabajador = _context.Trabajadores.Find(trabajador.Id);
                if (buscarTrabajador != null)
                {
                    buscarTrabajador.TipoDocumento = trabajador.TipoDocumento;
                    buscarTrabajador.NumeroDocumento = trabajador.NumeroDocumento;
                    buscarTrabajador.Nombres = trabajador.Nombres;
                    buscarTrabajador.Sexo = trabajador.Sexo;
                    buscarTrabajador.IdDepartamento = trabajador.IdDepartamento;
                    buscarTrabajador.IdProvincia = trabajador.IdProvincia;
                    buscarTrabajador.IdDistrito = trabajador.IdDistrito;
                    salida = _context.SaveChanges();
                }
            }catch(Exception ex)
            {
                salida = 0;
            }
           

            return Json(salida);

        }

        [HttpDelete]
        public IActionResult EliminarTrabajador(int id)
        {
            int salida = 0;
            try
            {
            var buscarTrabajador = _context.Trabajadores.Find(id);
            _context.Trabajadores.Remove(buscarTrabajador);
            salida = _context.SaveChanges();
            }
            catch (Exception e)
            {
                salida = 0;
            }

            return Json(salida);

        }


        [HttpGet]
        public IActionResult ListadoDepartamentos()
        {
            var departamentos = _context.Departamento.ToList();

            return Json(departamentos);
        }

        [HttpGet]
        public IActionResult ListadoProvincias(int idDepartamento)
        {
            var provincias = _context.Provincia.Where(p => p.IdDepartamento == idDepartamento).ToList();
            return Json(provincias);
        }

        [HttpGet]
        public IActionResult ListadoDistritos(int idProvincia)
        {
            var distrito = _context.Distrito.Where(d => d.IdProvincia == idProvincia).ToList();   
            return Json(distrito);
        }

        





    }
}
