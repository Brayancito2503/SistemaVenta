using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Municipio
{
    public int IdMunicipio { get; set; }

    public int? IdDepartamento { get; set; }

    public string? Nombre { get; set; }

    public virtual Departamento? IdDepartamentoNavigation { get; set; }

    public virtual ICollection<Proveedor> Proveedors { get; set; } = new List<Proveedor>();
}
