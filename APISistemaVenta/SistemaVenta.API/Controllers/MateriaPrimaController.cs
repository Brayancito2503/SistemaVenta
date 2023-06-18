using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.API.Utilidad;

namespace SistemaVenta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MateriaPrimaController : ControllerBase
    {
        private readonly IMateriaPrimaService _materiaprimaServicio;

        public MateriaPrimaController(IMateriaPrimaService materiaprimaServicio)
        {
            _materiaprimaServicio = materiaprimaServicio;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            var rsp = new Response<List<MateriaPrimaDTO>>();

            try
            {
                rsp.status = true;
                rsp.value = await _materiaprimaServicio.Lista();

            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;

            }
            return Ok(rsp);
        }


        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] MateriaPrimaDTO materiaPrima)
        {
            var rsp = new Response<MateriaPrimaDTO>();

            try
            {
                rsp.status = true;
                rsp.value = await _materiaprimaServicio.Crear(materiaPrima);

            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;

            }
            return Ok(rsp);

        }


        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] MateriaPrimaDTO materiaPrima)
        {
            var rsp = new Response<bool>();

            try
            {
                rsp.status = true;
                rsp.value = await _materiaprimaServicio.Editar(materiaPrima);

            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;

            }
            return Ok(rsp);

        }


        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rsp = new Response<bool>();

            try
            {
                rsp.status = true;
                rsp.value = await _materiaprimaServicio.Eliminar(id);

            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;

            }
            return Ok(rsp);

        }
    }
}
