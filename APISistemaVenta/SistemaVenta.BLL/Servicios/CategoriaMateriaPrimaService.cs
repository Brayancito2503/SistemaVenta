using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


using AutoMapper;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;


namespace SistemaVenta.BLL.Servicios
{
    public class CategoriaMateriaPrimaService : ICategoriaMateriaPrimaService
    {
        private readonly IGenericRepository<CategoriaMateriaPrima> _categoriaRepositorio;
        private readonly IMapper _mapper;

        public CategoriaMateriaPrimaService(IGenericRepository<CategoriaMateriaPrima> categoriaRepositorio, IMapper mapper)
        {
            _categoriaRepositorio = categoriaRepositorio;
            _mapper = mapper;
        }

        public async Task<List<CategoriaMateriaPrimaDTO>> Lista()
        {
            try
            {

                var listaCategorias = await _categoriaRepositorio.Consultar();
                return _mapper.Map<List<CategoriaMateriaPrimaDTO>>(listaCategorias.ToList());

            }
            catch
            {
                throw;
            }
        }
    }
}
