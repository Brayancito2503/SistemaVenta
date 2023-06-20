using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class CategoriaMateriaPrima
{
    public int IdCategoria { get; set; }

    public double? Cantidad { get; set; }

    public string? Nombre { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public bool? EsActivo { get; set; }

    public virtual ICollection<MateriaPrima> MateriaPrimas { get; set; } = new List<MateriaPrima>();
}
