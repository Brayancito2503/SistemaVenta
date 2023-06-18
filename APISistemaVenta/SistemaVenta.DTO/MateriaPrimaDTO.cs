using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class MateriaPrimaDTO
    {
        public int idProducto { get; set; }
        public int? idCategoria { get; set; }
        public string? nombre { get; set; }
        public float? cantidad { get; set; }
        public DateTime? fechaRegistro { get; set; }
        public bool? esActivo { get; set; }

    }
}
