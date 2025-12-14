/**
 * Conversión de unidades, de metros, yardas, pies y pulgadas
 * @method cambiarUnidades
 * @param {string} id - El id de los inputs de metros, yardas, pies o pulgadas
 * @param {number} valor - El valor de los inputs de metros, yardas, pies o pulgadas
 * @return Valor que retorna
 */
function cambiarUnidades(id, valor) {
    if (isNaN(valor)){
        alert("Se ingreso un valor invalido");
        document.lasUnidades.unid_metro.value = "";
        document.lasUnidades.unid_pulgada.value = "";
        document.lasUnidades.unid_pie.value = "";
        document.lasUnidades.unid_yarda.value = "";
    }
    else if (id==="metro")
    {
        document.lasUnidades.unid_pulgada.value = 39.3701*valor;
        document.lasUnidades.unid_pie.value = 3.28084*valor;
        document.lasUnidades.unid_yarda.value = 1.09361*valor;
    }
    else if (id==="pulgada")
    {
        document.lasUnidades.unid_metro.value = 0.0254*valor;
        document.lasUnidades.unid_pie.value = 0.083333*valor;
        document.lasUnidades.unid_yarda.value = 0.027778*valor;
    }
    else if (id==="pie")
    {
        document.lasUnidades.unid_pulgada.value = 12*valor;
        document.lasUnidades.unid_metro.value = 0.3048*valor;
        document.lasUnidades.unid_yarda.value = 0.3333*valor;
    }
    else if (id==="yarda")
    {
        document.lasUnidades.unid_pulgada.value = 36*valor;
        document.lasUnidades.unid_pie.value = 3*valor;
        document.lasUnidades.unid_metro.value = 0.9144*valor;
    }
}

function convertirGR(id){
    let grad, rad;
    if(id==="grados"){
        grad = document.getElementById("grados").value;
        rad = (grad*Math.PI)/180;
    }
    else if(id==="radianes")
    {
        rad = document.getElementById("radianes").value;
        grad = (rad*180)/Math.PI
    }
    document.getElementById("grados").value = grad;
    document.getElementById("radianes").value = rad;
}

function mostrar_ocultar(valorMO)
{
    if (valorMO==="val_mostrar")
    {
        document.getElementById("divMO").style.display = 'block';
    }
    else if(valorMO==="val_ocultar")
    {
        document.getElementById("divMO").style.display = 'none';
    }
}

function calcularSuma()
{
    let num1, num2;
    num1 = Number(document.getElementsByName("sum_num1") [0].value);
    num2 = document.getElementsByName("sum_num2") [0].value;
    document.getElementsByName("sum_total") [0].value = num1 + Number(num2);
}

function calcularResta()
{
    let num1, num2;
    num1 = Number(document.getElementsByName("res_num1") [0].value);
    num2 = document.getElementsByName("res_num2") [0].value;
    document.getElementsByName("res_total") [0].value = num1 - Number(num2);
}

function calcularMultiplication()
{
    let num1, num2;
    num1 = Number(document.getElementsByName("mul_num1") [0].value);
    num2 = document.getElementsByName("mul_num2") [0].value;
    document.getElementsByName("mul_total") [0].value = num1 * Number(num2);
}

function calcularDivision()
{
    let num1, num2;
    num1 = Number(document.getElementsByName("div_num1") [0].value);
    num2 = document.getElementsByName("div_num2") [0].value;
    document.getElementsByName("div_total") [0].value = num1 / Number(num2);
}