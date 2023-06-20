using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class MateriaPrimaDTO
    {
        public int IdMateriaPrima { get; set; }

        public int? IdCategoria { get; set; }

        public string? DescripcionCategoria { get; set; }

        public string? Nombre { get; set; }

        public double? Cantidad { get; set; }

        public int? EsActivo { get; set; }

      


    }
}
