using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Servicios
{
    public class MateriaPrimaService : IMateriaPrimaService
    {
        private readonly IGenericRepository<MateriaPrima> _productoRepositorio;
        private readonly IMapper _mapper;

        public MateriaPrimaService(IGenericRepository<MateriaPrima> materiaprimaRepositorio, IMapper mapper)
        {
            _productoRepositorio = materiaprimaRepositorio;
            _mapper = mapper;
        }

        public async Task<List<MateriaPrimaDTO>> Lista()
        {
            try
            {

                var queryMateriaPrima = await _productoRepositorio.Consultar();

                var listaMateriaPrima = queryMateriaPrima.Include(cat => cat.IdCategoriaNavigation).ToList();

                return _mapper.Map<List<MateriaPrimaDTO>>(listaMateriaPrima.ToList());

            }
            catch
            {
                throw;
            }
        }
        public async Task<MateriaPrimaDTO> Crear(MateriaPrimaDTO modelo)
        {
            try
            {
                var materiaprimaCreada = await _productoRepositorio.Crear(_mapper.Map<MateriaPrima>(modelo));

                if (materiaprimaCreada.IdMateriaPrima == 0)
                    throw new TaskCanceledException("No se pudo crear");

                return _mapper.Map<MateriaPrimaDTO>(materiaprimaCreada);

            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(MateriaPrimaDTO modelo)
        {
            try
            {

                var productoModelo = _mapper.Map<MateriaPrima>(modelo);
                var productoEncontrado = await _productoRepositorio.Obtener(u =>
                    u.IdMateriaPrima == productoModelo.IdMateriaPrima
                );

                if (productoEncontrado == null)
                    throw new TaskCanceledException("El producto no existe");


                productoEncontrado.IdCategoria = productoModelo.IdCategoria;
                productoEncontrado.IdMateriaPrima = productoModelo.IdMateriaPrima;
                productoEncontrado.Nombre = productoModelo.Nombre;
                productoEncontrado.Cantidad = productoModelo.Cantidad;
                productoEncontrado.FechaRegistro = productoModelo.FechaRegistro;
                productoEncontrado.EsActivo = productoModelo.EsActivo;


                bool respuesta = await _productoRepositorio.Editar(productoEncontrado);

                if (!respuesta)
                    throw new TaskCanceledException("No se pudo editar"); ;


                return respuesta;



            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {

                var productoEncontrado = await _productoRepositorio.Obtener(p => p.IdMateriaPrima == id);

                if (productoEncontrado == null)
                    throw new TaskCanceledException("El producto no existe");

                bool respuesta = await _productoRepositorio.Eliminar(productoEncontrado);


                if (!respuesta)
                    throw new TaskCanceledException("No se pudo elminar"); ;

                return respuesta;

            }
            catch
            {
                throw;
            }
        }

    }
}
