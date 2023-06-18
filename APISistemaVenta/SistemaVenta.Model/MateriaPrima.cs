using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class MateriaPrima
{
    public int idProducto { get; set; }

    public int? idCategoria { get; set; }

    public string? nombre { get; set; }

    public float? cantidad { get; set; }

    public DateTime? fechaRegistro { get; set; }

    public bool? esActivo { get; set; }

    public virtual Categoria? IdCategoriaNavigation { get; set; }


}

