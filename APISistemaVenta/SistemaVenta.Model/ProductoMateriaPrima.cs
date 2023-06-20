using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class ProductoMateriaPrima
{
    public int IdProductoMateriaPrima { get; set; }

    public int? IdMateriaPrima { get; set; }

    public int? IdProducto { get; set; }

    public double? CantidadUsada { get; set; }

    public virtual MateriaPrima? IdMateriaPrimaNavigation { get; set; }

    public virtual MateriaPrima? IdMateriaNavigation { get; set; }
}
