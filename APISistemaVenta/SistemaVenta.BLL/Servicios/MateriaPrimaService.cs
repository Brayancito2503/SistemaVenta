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

                if (materiaprimaCreada.idProducto == 0)
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
                    u.idProducto == productoModelo.idProducto
                );

                if (productoEncontrado == null)
                    throw new TaskCanceledException("El producto no existe");


                productoEncontrado.idCategoria = productoModelo.idCategoria;
                productoEncontrado.idProducto = productoModelo.idProducto;
                productoEncontrado.nombre = productoModelo.nombre;
                productoEncontrado.cantidad = productoModelo.cantidad;
                productoEncontrado.fechaRegistro = productoModelo.fechaRegistro;
                productoEncontrado.esActivo = productoModelo.esActivo;


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

                var productoEncontrado = await _productoRepositorio.Obtener(p => p.idProducto == id);

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
