using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class MateriaPrima
{
    public int IdMateriaPrima { get; set; }

    public int? IdCategoria { get; set; }

    public string? Nombre { get; set; }

    public double? Cantidad { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public bool? EsActivo { get; set; }

    public decimal? Precio { get; set; }

    public virtual CategoriaMateriaPrima? IdCategoriaNavigation { get; set; }

    public virtual ICollection<ProductoMateriaPrima> ProductoMateriaPrimas { get; set; } = new List<ProductoMateriaPrima>();

    //public virtual ICollection<ProveedorMateriaPrima> ProveedorMateriaPrimas { get; set; } = new List<ProveedorMateriaPrima>();
}
