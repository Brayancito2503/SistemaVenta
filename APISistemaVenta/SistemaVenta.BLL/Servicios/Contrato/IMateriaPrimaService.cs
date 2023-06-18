using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.DTO;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface IMateriaPrimaService
    {
        Task<List<MateriaPrimaDTO>> Lista();
        Task<MateriaPrimaDTO> Crear(MateriaPrimaDTO modelo);
        Task<bool> Editar(MateriaPrimaDTO modelo);
        Task<bool> Eliminar(int id);
    }
}
