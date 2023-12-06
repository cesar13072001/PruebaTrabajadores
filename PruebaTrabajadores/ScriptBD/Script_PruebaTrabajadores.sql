USE TrabajadoresPrueba
GO


create or alter proc sp_listarTrabajadores
as
begin
select t.Id, t.TipoDocumento, t.NumeroDocumento, t.Nombres,t.Sexo,
de.NombreDepartamento, pr.NombreProvincia, di.NombreDistrito 
from trabajadores t inner join departamento de
on t.IdDepartamento = de.Id
inner join provincia pr
on t.IdProvincia = pr.Id
inner join distrito di 
on t.IdDistrito = di.Id
end
Go