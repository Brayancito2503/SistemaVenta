using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Proveedor
{
    public int IdProveedor { get; set; }

    public string? Ruc { get; set; }

    public int? IdNumeroTelefono { get; set; }

    public int? IdMunicipio { get; set; }

    public string? Nombre { get; set; }

    public virtual Municipio? IdMunicipioNavigation { get; set; }

    public virtual NumerosTelefono? IdNumeroTelefonoNavigation { get; set; }

    public virtual ICollection<ProveedorMateriaPrima> ProveedorMateriaPrimas { get; set; } = new List<ProveedorMateriaPrima>();
}
