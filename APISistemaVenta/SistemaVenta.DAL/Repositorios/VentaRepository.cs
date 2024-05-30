using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.DAL.DBContext;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.Model;

namespace SistemaVenta.DAL.Repositorios
{
    public class VentaRepository : GenericRepository<Venta> , IVentaRepository
    {

        private readonly DbventaContext _dbcontext;

        public VentaRepository(DbventaContext dbcontext) : base(dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Venta> Registrar(Venta modelo)
        {
            Venta ventaGenerada = new Venta();

            using (var trasaction = _dbcontext.Database.BeginTransaction())
            {
                try {

                    foreach (DetalleVenta dv in modelo.DetalleVenta)
                    {

                        var result = (from dvs in _dbcontext.DetalleVenta
                                      join p in _dbcontext.Productos on dvs.IdProducto equals p.IdProducto
                                      join pm in _dbcontext.ProductoMateriaPrimas on p.IdProducto equals pm.IdProducto
                                      join mp in _dbcontext.MateriaPrimas on pm.IdMateriaPrima equals mp.IdMateriaPrima
                                      where dvs.IdProducto == dv.IdProducto
                                      orderby dvs.IdDetalleVenta
                                      select new MateriaPrima
                                      {
                                          IdMateriaPrima = mp.IdMateriaPrima,
                                          Cantidad = mp.Cantidad,
                                      }).Distinct().ToList();


                        foreach (var producto_encontrado in result)
                        {
                            var materiaPrima = _dbcontext.MateriaPrimas.FirstOrDefault(mp => mp.IdMateriaPrima == producto_encontrado.IdMateriaPrima);
                            if (materiaPrima != null)
                            {
                                materiaPrima.Cantidad -= dv.Cantidad; // Resta la cantidad vendida
                            }
                        }


                        //_dbcontext.MateriaPrimas.Update(materiaPrima);
                    }
                    await _dbcontext.SaveChangesAsync();

                    NumeroDocumento correlativo = _dbcontext.NumeroDocumentos.First();

                    correlativo.UltimoNumero = correlativo.UltimoNumero + 1;
                    correlativo.FechaRegistro = DateTime.Now;

                    _dbcontext.NumeroDocumentos.Update(correlativo);
                    await _dbcontext.SaveChangesAsync();

                    int CantidadDigitos = 4;
                    string ceros = string.Concat(Enumerable.Repeat("0", CantidadDigitos));
                    string numeroVenta = ceros + correlativo.UltimoNumero.ToString();
                    //00001
                    numeroVenta = numeroVenta.Substring(numeroVenta.Length - CantidadDigitos, CantidadDigitos);

                    modelo.NumeroDocumento = numeroVenta;

                    await _dbcontext.Venta.AddAsync(modelo);
                    await _dbcontext.SaveChangesAsync();

                    ventaGenerada = modelo;

                    trasaction.Commit();
 
                } catch {
                    
                    trasaction.Rollback();
                    throw;
                }

                return ventaGenerada;
            
            }



        }
    }
}
