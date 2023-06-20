using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class ProveedorMateriaPrima
{
    public int IdProveedorMateriaPrima { get; set; }

    public int? IdMateriaPrima { get; set; }

    public int? IdProveedor { get; set; }

    public DateTime? FechaEntrega { get; set; }

    public double? Precio { get; set; }

    public double? Cantidad { get; set; }

    public virtual MateriaPrima? IdMateriaPrimaNavigation { get; set; }

    public virtual Proveedor? IdProveedorNavigation { get; set; }
}
