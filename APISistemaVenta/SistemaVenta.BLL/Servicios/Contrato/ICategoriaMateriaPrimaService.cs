using SistemaVenta.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Servicios.Contrato
{
    public interface ICategoriaMateriaPrimaService
    {
        Task<List<CategoriaMateriaPrimaDTO>> Lista();
    }
}
