using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using SistemaVenta.BLL.Servicios.Contrato;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.Model;


namespace SistemaVenta.BLL.Servicios
{
    public class RolService : IRolService
    {

        private readonly IGenericRepository<Rol> _rolRepositorio;
        private readonly IMapper _mapper;

        public RolService(IGenericRepository<Rol> rolRepositorio, IMapper mapper)
        {
            _rolRepositorio = rolRepositorio;
            _mapper = mapper;
        }

        public async Task<List<RolDTO>> Lista()
        {
            try {
                var listaRoles = await _rolRepositorio.Consultar();
                return _mapper.Map<List<RolDTO>>(listaRoles.ToList());

            } catch {
                throw;
            }
        }
    }
}
