
function openMaximized(url) {
    var mywindow = window.open(url, 'EDICION', 'height=' + screen.height + ',width=' + screen.width + ',resizable=yes,scrollbars=yes');
    mywindow.moveTo(0, 0);
};

$(function () {
    $("#butBuscar").button({
        icons: {
            primary: "ui-icon-search"
        }
    }).bind('click', function () {
        Captura('1');
        return false;
    });

    $("#butManual").button({
        icons: {
            primary: "ui-icon-help"
        }
    }).bind('click', function () {
        openMaximized("https://www.mef.gob.pe/contenidos/inv_publica/docs/Instructivo_BI/Instructivo_consulta_avanzada.pdf");
        return false;
    });

    $("#txtNom").bind('blur', function () {
        $(this).val($(this).val().toUpperCase());
    });

    $("#butRecargar").button({
        icons: {
            primary: "ui-icon-refresh"
        }
    }).bind('click', function () {
        waitingDialog({});
        window.location.href = window.location.href;
        return false;
    });

    $("#butBack").button({
        icons: {
            primary: "ui-icon-arrowreturnthick-1-w"
        }
    }).bind('click', function () {
        $('#divData').hide();
        $('#divFilter').show();

        return false;
    });

    $("#butExportar").button({
        icons: {
            primary: "ui-icon-folder-collapsed"
        }
    }).bind('click', function () {
        Captura('2');
        return false;
    });

    $("#butExportar01").button({
        icons: {
            primary: "ui-icon-folder-open"
        }
    }).bind('click', function () {
        Captura('3');
        return false;
    });

    $("input[name='txtIni']").datepicker($.datepicker.regional['es']);
    $("input[name='txtFin']").datepicker($.datepicker.regional['es']);
    $("input[name='txtIni']").datepicker({
        showOn: "button",
        buttonImage: "img/calendar.png",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy',
        onSelect: function (dateText, inst) { SetFin(dateText, inst); }
    });
    $("input[name='txtFin']").datepicker({
        showOn: "button",
        maxDate: 0,
        buttonImage: "img/calendar.png",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy'
    });

    $("input[name='txtIni']").inputmask("dd/mm/yyyy");
    $("input[name='txtFin']").inputmask("dd/mm/yyyy");
    $("#txtMin").inputmask("decimal", { autoGroup: true, groupSeparator: ",", groupSize: 3 });
    $("#txtMax").inputmask("decimal", { autoGroup: true, groupSeparator: ",", groupSize: 3 });
    $("#txtMin").val('');
    $("#txtMax").val('');

    $('#divFilter').corner();
    $('#divData').corner();
    $('.divFooter').corner();
    $('input[name="optUf"]').click(function () {
        ShowUF($(this).val());
        SetUFDefault();
    });
    $('input[name="optGL"]').click(function () {
        ShowGL($(this).val());
    });

    $('input[name="rbtUbigeo"]').click(function () {
        SetUbigeo($(this).val());
    });

    //$('#tdUf > div').hide();
    $('#tdUf').hide();
    //$('#tblFecha').hide();
    $('.tdFecViab').hide();
    $('.tdFecInvierte').hide();


    $('td.tblMonto').hide();

    $('input[name="optFecha"]').click(function () {
        ShowFecha($(this).val());
    });
    $('#chkMonto').click(function () {
        ShowMonto($(this).is(':checked'));
    });
    $("#divLoad").dialog({
        autoOpen: false, // set this to false so we can manually open it
        dialogClass: "loadingScreenWindow",
        closeOnEscape: false,
        draggable: false,
        width: 460,
        minHeight: 50,
        modal: true,
        buttons: {},
        resizable: false,
        open: function () {
            // scrollbar fix for IE
            $('body').css('overflow', 'hidden');
        },
        close: function () {
            // reset overflow
            $('body').css('overflow', 'auto');
        }
    }); // end of dialog
    waitingDialog({});
    LLenaCombos();
    AsignaName();
    Carga();

    // Inicializa valores            
    //$('#optGN').attr('checked', true);
    $('#optFecha').attr('checked', true);
    $('#chkMonto').attr('checked', false);

    SetUbigeo("DEP");
    //ShowUF('GN');
    ShowFecha('*');
    $("span.ui-icon-arrowthick-2-n-s").each(function () {
        $(this).hide();
    });

    //Cadena funcional
    $("#optCadTodos").attr('checked', true);
    $('input[name="rbtnCadena"]').change(function () {
        changeSelCadena();
    });

    $("#cboFuncion").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    $("#cboDivision").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    $("#cboGrupo").empty().append($("<option/>").attr("value", "0").text("Seleccione"));

    //$("#iframe").load(function () { var result = $("#iframe").contents().find('body').html(); console.log(result); })
    $("#cboFuncion").change(function () {
        changeDivision();
    });
    $("#cboDivision").change(function () {
        changeGrupo();
    });
});

var vmConsulta = {};
function changeSelCadena() {
    var tipoCad = $('input[name="rbtnCadena"]:checked').val();

    $("#cboFuncion").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    $("#cboDivision").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    $("#cboGrupo").empty().append($("<option/>").attr("value", "0").text("Seleccione"));

    if (tipoCad != "T") changeFuncion();
};

function changeFuncion() {
    var tipoCad = $('input[name="rbtnCadena"]:checked').val();

    $("#cboDivision").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    $("#cboGrupo").empty().append($("<option/>").attr("value", "0").text("Seleccione"));

    CallAjax({
        url: "/invierte/ConsultaPublica/traeListaFuncion",
        data: { tipoCad: tipoCad },
        success: FindFuncion
    });
};

function changeDivision() {
    var tipoCad = $('input[name="rbtnCadena"]:checked').val();

    $("#cboGrupo").empty().append($("<option/>").attr("value", "0").text("Seleccione"));

    CallAjax({
        url: "/invierte/ConsultaPublica/traeListaDivision",
        data: { tipoCad: tipoCad, COD_FUNCION: $("#cboFuncion").val() },
        success: FindDivision
    });
};

function changeGrupo() {
    var tipoCad = $('input[name="rbtnCadena"]:checked').val();
    CallAjax({
        url: "/invierte/ConsultaPublica/traeListaGrupo",
        data: { tipoCad: tipoCad, COD_FUNCION: $("#cboFuncion").val(), COD_PROGRAMA: $("#cboDivision").val() },
        success: FindGrupo
    });
};

function AsignaName() {
    $('input[type="text"]').each(function () {
        var id = $(this).attr("id");
        $(this).attr("name", id);
    });
    $('select').each(function () {
        var id = $(this).attr("id");
        $(this).attr("name", id);
    });
}
function ShowUF(val) {

    $('#divGN').hide();
    $('#divGR').hide();
    $('#divGL').hide();
    $('#optGLTodos').attr('checked', true);
    ShowGL('*');
    $('#divEM').hide();
    if (val != '*') {
        $('#tdUf').show();
        $('#div' + val).show();
    } else {
        $('#tdUf').hide();
    }
}
function ShowGL(val) {
    $('#divMUN').hide();
    $('#divMN').hide();
    if (val != '*') $('#div' + val).show();
}
function ShowFecha(val) {


    //if (val == '*')
    //    $('#tblFecha').hide();
    //else
    //    $('#tblFecha').show();
    if (val == '*') {
        $('.tdFecInvierte').hide();
        $('.tdFecViab').hide();
    }
    else if (val == 'I') {
        $('.tdFecInvierte').show();
        $('.tdFecViab').hide();
    }
    else if (val == 'V') {
        $('.tdFecInvierte').hide();
        $('.tdFecViab').show();
    }

}
function ShowMonto(val) {
    if (val)
        $('td.tblMonto').show();
    else
        $('td.tblMonto').hide();
}

function SetFin(dateText, inst) {
    $("input[name='txtFin']").datepicker("option", "minDate", dateText);
}
function SetUbigeo(ubigeo) {
    var actDpto = true,
        actPrv = ubigeo != "DEP" ? true : false,
        actDst = ubigeo == "DST" ? true : false;

    $("#cboDpto").attr("disabled", !actDpto);
    $("#cboProv").attr("disabled", !actPrv);
    $("#cboDist").attr("disabled", !actDst);
}
function IsUbigeoCompleted() {
    var ubigeo = $('input[name="rbtUbigeo"]:checked').val();
    var value = "0";

    if (ubigeo == "DEP")
        value = $("#cboDpto").val();
    else if (ubigeo == "PRV")
        value = $("#cboProv").val();
    else
        value = $("#cboDist").val();

    return value != "0";
}
function GetValSector() {
    var tipoUF = $('input[name="optUf"]:checked').val();
    var data = "";

    if (tipoUF == "GN") {
        data = $("#cboGNSect").val() + $("#cboGNPlie").val() + $("#cboGNUF").val();
        data = data.replace('***', '');
    }
    else if (tipoUF == "GR") {
        data = $("#cboGR").val() + $("#cboGRUf").val();
        data = data.replace('**', '');
    }
    else {
        var tipoGL = $('input[name="optGL"]:checked').val();

        if (tipoGL == "MUN") {
            data = $("#cboGLDpto").val();
            data = data.replace('*', '');
        }
        else if (tipoGL == "MN") {
            data = $("#cboGLManPlie").val();
            data = data.replace('*', '');
        }
        else //(tipoGL == "*")
            data = "";
    }
    return data;
};

function SetUFDefault() {
    $("#cboGNSect").val("*");
    //$("#cboGNPlie").empty().append($("<option/>").attr("value", "*").text("Seleccione una Entidad"));
    //$("#cboGNUF").empty().append($("<option/>").attr("value", "*").text("Seleccione una Unidad Formuladora"));

    $("#cboGR").val("*");
    //$("#cboGRUf").empty().append($("<option/>").attr("value", "*").text("Seleccione una Unidad Formuladora"));

    $("#cboGLDpto").val("*");
    $("#cboGLProv").empty().append($("<option/>").attr("value", "*").text("Seleccione una provincia"));
    $("#cboGLDist").empty().append($("<option/>").attr("value", "*").text("Seleccione una municipalidad"));
    //$("#cboGLUf").empty().append($("<option/>").attr("value", "*").text("Seleccione una Unidad Formuladora"));

    $("#cboGLManPlie").val("*");
    //$("#cboGLManUf").empty().append($("<option/>").attr("value", "*").text("Seleccione una Unidad Formuladora"));
};

function Captura(tipo) {
    if (tipo == "1") {
        var dataSec = GetValSector();


        $('#hdnFlag').val("0");
        waitingDialog({});
        $("#divGrid").jqGrid('setGridParam', {
            page: 1,
            postData: {
                ip: $('#hdnIp').val(),
                tipo: tipo,
                cboNom: $('#cboNom').val(),
                txtNom: $('#txtNom').val(),
                cboDpto: $('#cboDpto').val(),
                cboProv: $('#cboProv').val(),
                cboDist: $('#cboDist').val(),
                //------------------------------------------------//
                optUf: $('input[name=optUf]:checked').val(),
                cboGNSect: $('#cboGNSect').val(),
                cboGNPlie: $('#cboGNPlie').val(),
                cboGNUF: $('#cboGNUF').val(),
                cboGR: $('#cboGR').val(),
                cboGRUf: $('#cboGRUf').val(),
                optGL: $('input[name=optGL]:checked').val(),
                cboGLDpto: $('#cboGLDpto').val(),
                cboGLProv: $('#cboGLProv').val(),
                cboGLDist: $('#cboGLDist').val(),
                cboGLUf: $('#cboGLUf').val(),
                cboGLManPlie: $('#cboGLManPlie').val(),
                cboGLManUf: $('#cboGLManUf').val(),
                //------------------------------------------------//
                cboSitu: $('#cboSitu').val(),
                cboNivReqViab: $('#cboNivReqViab').val(),
                cboEstu: $('#cboEstu').val(),
                cboEsta: $('#cboEsta').val(),
                optFecha: $('input[name=optFecha]:checked').val(),
                //txtIni: $('#txtIni').val(),
                //txtFin: $('#txtFin').val(),
                txtIni: $('input[name="optFecha"]:checked').val() == "*" ? "" : ($('input[name="optFecha"]:checked').val() == "I" ? $("#txtIniInvierte").val() : $("#txtIniViab").val()),
                txtFin: $('input[name="optFecha"]:checked').val() == "*" ? "" : ($('input[name="optFecha"]:checked').val() == "I" ? $("#txtFinInvierte").val() : $("#txtFinViab").val()),
                chkMonto: $('#chkMonto').is(':checked'),
                txtMin: $('#txtMin').val(),
                txtMax: $('#txtMax').val(),
                cboFunc: $('#cboFuncion').val(),
                chkInactivo: $('#chkInactivo').is(':checked') ? "1" : "0",
                cboDivision: $('#cboDivision').val(),
                cboGrupo: $('#cboGrupo').val(),
                rbtnCadena: $('input[name=rbtnCadena]:checked').val(),
                chkFoniprel: $('#chkfoniprel').is(':checked') ? "1" : ""
            }
        });
        $("#divGrid").trigger("reloadGrid");

    }
    if (tipo == "2" || tipo == "3") {
        //var data = 'tipo=' + tipo + '&cboNom=' + $('#cboNom').val() + '&txtNom=' + $('#txtNom').val() + '&cboDpto=' + $('#cboDpto').val() + '&cboProv=' + $('#cboProv').val() + '&cboDist=' + $('#cboDist').val();
        //data = data + '&optUf=' + $('input[name=optUf]:checked').val() + '&cboGNSect=' + $('#cboGNSect').val() + '&cboGNPlie=' + $('#cboGNPlie').val();
        //data = data + '&cboGNUF=' + $('#cboGNUF').val() + '&cboGR=' + $('#cboGR').val() + '&cboGRUf=' + $('#cboGRUf').val() + '&optGL=' + $('input[name=optGL]:checked').val();
        //data = data + '&cboGLManPlie=' + $('#cboGLManPlie').val() + '&cboGLManUf=' + $('#cboGLManUf').val() + '&cboGLDpto=' + $('#cboGLDpto').val();
        //data = data + '&cboGLProv=' + $('#cboGLProv').val() + '&cboGLDist=' + $('#cboGLDist').val() + '&cboGLUf=' + $('#cboGLUf').val() + '&cboSitu=' + $('#cboSitu').val();
        //data = data + '&cboNivReqViab=' + $('#cboNivReqViab').val() + '&cboEstu=' + $('#cboEstu').val() + '&cboEsta=' + $('#cboEsta').val() + '&optFecha=' + $('input[name=optFecha]:checked').val();
        //data = data + '&txtIni=' + $('#txtIni').val() + '&txtFin=' + $('#txtFin').val() + '&chkMonto=' + $('#chkMonto').is(':checked') + '&txtMin=' + $('#txtMin').val();
        //data = data + '&txtMax=' + $('#txtMax').val() + '&cboFunc=' + $('#cboFuncion').val() + '&chkInactivo=' + ($('#chkInactivo').is(':checked') ? "1" : "0");
        //data = data + '&cboDivision=' + $('#cboDivision').val() + '&cboGrupo=' + $('#cboGrupo').val() + '&rbtnCadena=' + $('input[name=rbtnCadena]:checked').val();

        //var url = 'wsConsulta.asmx/ExportarListado';
        //url += '?' + data;

        //window.location.href = url;
        var parametros = {
            cboNom: $('#cboNom').val(),
            txtNom: $('#txtNom').val(),
            cboDpto: $('#cboDpto').val(),
            cboProv: $('#cboProv').val(),
            cboDist: $('#cboDist').val(),
            //------------------------------------------------//
            optUf: $('input[name=optUf]:checked').val(),
            cboGNSect: $('#cboGNSect').val(),
            cboGNPlie: $('#cboGNPlie').val(),
            cboGNUF: $('#cboGNUF').val(),
            cboGR: $('#cboGR').val(),
            cboGRUf: $('#cboGRUf').val(),
            optGL: $('input[name=optGL]:checked').val(),
            cboGLDpto: $('#cboGLDpto').val(),
            cboGLProv: $('#cboGLProv').val(),
            cboGLDist: $('#cboGLDist').val(),
            cboGLUf: $('#cboGLUf').val(),
            cboGLManPlie: $('#cboGLManPlie').val(),
            cboGLManUf: $('#cboGLManUf').val(),
            //------------------------------------------------//
            cboSitu: $('#cboSitu').val(),
            cboNivReqViab: $('#cboNivReqViab').val(),
            cboEstu: $('#cboEstu').val(),

            cboEsta: $('#cboEsta').val(),
            optFecha: $('input[name=optFecha]:checked').val(),
            txtIni: $('input[name="optFecha"]:checked').val() == "*" ? "" : ($('input[name="optFecha"]:checked').val() == "I" ? $("#txtIniInvierte").val() : $("#txtIniViab").val()),
            txtFin: $('input[name="optFecha"]:checked').val() == "*" ? "" : ($('input[name="optFecha"]:checked').val() == "I" ? $("#txtFinInvierte").val() : $("#txtFinViab").val()),
            chkMonto: $('#chkMonto').is(':checked'),
            txtMin: $('#txtMin').val(),
            txtMax: $('#txtMax').val(),
            cboFunc: $('#cboFuncion').val(),
            chkInactivo: $('#chkInactivo').is(':checked') ? "1" : "0",
            tipo: tipo,

            cboDivision: $('#cboDivision').val(),
            cboGrupo: $('#cboGrupo').val(),
            rbtnCadena: $('input[name=rbtnCadena]:checked').val(),

            chkFoniprel: $('#chkfoniprel').is(':checked') ? "1" : ""
        };
        DescargarConsultaAvanzada(parametros);
    }
}

function Carga() {

    var grd = $("#divGrid").jqGrid({
        // setup custom parameter names to pass to server
        prmNames: {
            search: "isSearch",
            nd: null,
            //rows: "numRows",
            //page: "page",
            rows: "PageSize",
            page: "PageIndex",
            sort: "sortField",
            order: "sortOrder"
        },
        postData: {
            filters: '', ip: '', cboNom: '1', txtNom: $('#txtNom').val(), cboDpto: '', cboProv: '', cboDist: '',
            //-------------------------------------------------------------------//
            optUf: '', cboGNSect: '', cboGNPlie: '', cboGNUF: '',
            cboGR: '', cboGRUf: '',
            optGL: '', cboGLDpto: '', cboGLProv: '', cboGLDist: '', cboGLUf: '',
            cboGLManPlie: '', cboGLManUf: '',
            //-------------------------------------------------------------------//
            cboSitu: '', cboNivReqViab: '',
            cboEstu: '', cboEsta: '', optFecha: '', txtIni: '', txtFin: '', chkMonto: '', txtMin: '', txtMax: '', tipo: $('#hdnFlag').val(), cboFunc: '', chkInactivo: '0',
            cboDivision: '', cboGrupo: '', rbtnCadena: ''
        },
        datatype: function (postdata) {
            CallAjax({
                url: "/invierte/ConsultaPublica/traeListaProyectoConsultaAvanzada",
                data: postdata,
                success: function (data) {

                    if (data.Data != null) {
                        if (data.Data.length > 0) {
                            $("#divGrid").ParseDataToJqGrid(data);
                        } else {
                            $("#divMnsj").html("No se encontraron registros.");
                            CallMnsj();
                        }
                    } else {
                        $("#divMnsj").html("Ha ocurrido un error al procesar su consulta. Por favor intente nuevamente.");
                        CallMnsj();
                    }

                    closeWaitingDialog();
                    $(".loading").hide();
                }
            });

        },
        jsonReader: {
            root: "rows",
            page: "page",
            total: "totalpages",
            records: "totalrecords",
            cell: "cell",
            id: "Codigo", //index of the column with the PK in it 
            userdata: "userdata",
            repeatitems: true
        },
        // this is what jqGrid is looking for in json callback
        colNames: [//'#', 
            'C. único de inversión', 
            'C. SNIP',
            'Nombre de la inversión',
            '*Docs. viabilidad',
            'Monto viable',
            '*Inversion total',
            '*Indic. Met. eval.',
            '*N. alternativas',
            'Marco',
            'Fecha viabilidad',
            'Niv. gobierno', 
            'Entidad',
            'Situación',
            'Fecha de registro', 
            'Estado de la inversión', 
            'Sector', 
            'Unidad OPMI',
            'Unidad UEI',
            'Unidad UF',
            'Responsable OPMI',
            'Responsable UEI',
            'Responsable UF',
            'Función',
            'Programa',
            'Subprograma', 
            'Departamento', 
            'Nivel de viabilidad',
            'Estado del estudio',
            'Último estudio',
            'Tipo de desactivacion',
            'Entidad OPI',
            'Responsable OPI',
            'Ejecutora',
            'Responsable de viabilidad',
            'Con F15',
            'Con F14',
            'Monto F15',
            'Monto F16',
            'Monto F17',
            'Costo actualizado',
            'Descripción de la alternativa',
            'Beneficiarios',
            'PIA año vigente',
            'PIM año vigente',
            'Devengado año vigente',
            'Devengado acumulado',
            'Devengado acumulado año anterior',
            'Saldo por financiar',
            'Mes/año primer devengado',
            'Mes/año último devengado',
            'Cerrado',
            'Tipo de formato',
            'Incluido programación PMI',
            'Incluido ejecución PMI',
            'Ganador FONIPREL',
            'Código Convenio',
            'Tipo de convenio',
            'N° de convenio',
            'Encargado del convenio',
            'Encargante del convenio',
            'Fecha de inicio de convenio',
            'Fecha de término de convenio',
            'Fecha de registro de convenio',
            'Estado del convenio'
        ],
        colModel: [
            { name: 'CodigoUnico', index: 'CodigoUnico', width: 50, search: false, align: 'center', hidedlg: true },
            { name: 'Codigo', index: 'Codigo', width: 50, search: false, align: 'center', hidedlg: true },
            { name: 'Nombre', index: 'Nombre', width: 200, search: true, formatter: showLinkBP, hidedlg: true },
            { name: 'DocumentosDeViabiliadad', index: 'DocumentosDeViabiliadad', width: 50, search: false, hidedlg: true },
            {
                name: 'MontoAlternativa', index: 'MontoAlternativa', width: 90, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }
            },
            { name: 'MontoReall', index: 'MontoReall', width: 90, search: false, hidedlg: true },
            { name: 'Indicadores', index: 'Indicadores', width: 70, search: false, hidedlg: true },
            { name: 'Nalternativas', index: 'Nalternativas', width: 40, search: false, hidedlg: true },
            { name: 'Marco', index: 'Marco', width: 50 },
            { name: 'FechaViabilidad', index: 'FechaViabilidad', width: 70 },
            { name: 'Nivel', index: 'Nivel', width: 40, search: true },
            { name: 'Pliego', index: 'Pliego', width: 90, search: true },
            { name: 'Situacion', index: 'Situacion', width: 70, search: true },
            { name: 'FechaRegistro', index: 'FechaRegistro', width: 80, hidden: true },
            { name: 'Estado', index: 'Estado', width: 125, search: true , hidden: true},
            { name: 'Sector', index: 'Sector', width: 90, search: true, hidden: true },
            { name: 'Opmi', index: 'Opmi', width: 100, search: true, hidden: true },
            { name: 'Uei', index: 'Uei', width: 100, search: true, hidden: true },
            { name: 'Uf', index: 'Uf', width: 100, search: true, hidden: true },
            { name: 'ResponsableOpmi', index: 'ResponsableOpmi', width: 100, search: true, hidden: true },
            { name: 'ResponsableUei', index: 'ResponsableUei', width: 100, search: true, hidden: true },
            { name: 'ResponsableUf', index: 'ResponsableUf', width: 100, search: true, hidden: true },
            { name: 'Funcion', index: 'Funcion', width: 100, search: true, hidden: true },
            { name: 'Programa', index: 'Programa', width: 100, search: true, hidden:true },
            { name: 'Subprograma', index: 'Subprograma', width: 100, search: true, hidden: true },
            { name: 'LocalizacionDepartamento', index: 'LocalizacionDepartamento', width: 100, search: true, hidden: true },//NUEVO
            { name: 'NivelViabilidad', index: 'NivelViabilidad', width: 50, hidden: true },
            { name: 'EstadoEstudio', index: 'EstadoEstudio', width: 50, hidden: true },
            { name: 'UltimoEstudio', index: 'UltimoEstudio', width: 50, hidden: true },
            { name: 'TipoDesactivacion', index: 'TipoDesactivacion', width: 150, search: true,  hidden: true },
            { name: 'Opi', index: 'Opi', width: 100, search: true, hidden: true },
            { name: 'ResponsableOpi', index: 'ResponsableOpi', width: 100, search: true, hidden: true },
            { name: 'Ejecutora', index: 'Ejecutora', width: 80, hidden: true },
            { name: 'ResponsableViabilidad', index: 'ResponsableViabilidad', width: 90, hidden: true },
            { name: 'FlagExpedienteTecnico', index: 'FlagExpedienteTecnico', formatter: 'checkbox', align: 'center', width: 100, hidden: true },
            { name: 'FlagCerrado', index: 'FlagCerrado', formatter: 'checkbox', align: 'center', width: 100, hidden: true },
            {
                name: 'MontoF15', index: 'MontoF15', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'MontoF16', index: 'MontoF16', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'MontoF17', index: 'MontoF17', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'Costo', index: 'Costo', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            { name: 'Alternativa', index: 'Alternativa', width: 150, hidden: true },
            {
                name: 'Beneficiarios', index: 'Beneficiarios', width: 80, search: true, align: 'right', formatter: 'integer',
                formatoptions: { thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'PiaActual', index: 'PiaActual', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'PimActual', index: 'PimActual', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'DevActual', index: 'DevActual', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'DevAcumulado', index: 'DevAcumulado', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'DevAcumuladoAnterior', index: 'DevAcumuladoAnterior', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            {
                name: 'SaldoPorFinanciar', index: 'SaldoPorFinanciar', width: 100, search: true, align: 'right', formatter: 'currency',
                formatoptions: { prefix: 'S/. ', decimalPlaces: 0, thousandsSeparator: ',' }, hidden: true
            },
            { name: 'MesAnioPDev', index: 'MesAnioPDev', width: 90, hidden: true },
            { name: 'MesAnioUDev', index: 'MesAnioUDev', width: 90, hidden: true },
            { name: 'FlagCerrado', index: 'FlagCerrado', width: 80, hidden: true },
            { name: 'TipoFormato', index: 'TipoFormato', width: 150, hidden: false },
            { name: 'IncluidoProgramacionPmi', index: 'IncluidoProgramacionPmi', width: 90, hidden: true },
            { name: 'IncluidoEjecucionPmi', index: 'IncluidoEjecucionPmi', width: 90, hidden: true },
            { name: 'GanadorFoniprel', index: 'GanadorFoniprel', width: 90, hidden: true },
            { name: 'IdConvenio', index: 'IdConvenio', width: 90, hidden: true },
            { name: 'TipoConvenio', index: 'TipoConvenio', width: 90, hidden: true },
            { name: 'NroConvenio', index: 'NroConvenio', width: 120, hidden: true },
            { name: 'EncargadoConvenio', index: 'EncargadoConvenio', width: 150, hidden: true },
            { name: 'EncarganteConvenio', index: 'EncarganteConvenio', width: 150, hidden: true },
            { name: 'FechaInicioConvenio', index: 'FechaInicioConvenio', width: 90, hidden: true },
            { name: 'FechaFinConvenio', index: 'FechaFinConvenio', width: 90, hidden: true },
            { name: 'FechaRegistroConvenio', index: 'FechaRegistroConvenio', width: 90, hidden: true },
            { name: 'EstadoConvenio', index: 'EstadoConvenio', width: 90, hidden: true },
        ],
        rowNum: 10,
        rowList: [10, 20, 30],
        pager: $("#divPager"),
        sortname: "MontoAlternativa",
        sortorder: "desc",
        viewrecords: true,
        caption: "Listado de Proyectos",
        shrinkToFit: false,
        width: 1089,
        height: "auto",
        ignoreCase: true,
        rownumbers: true,
        loadError: function (xhr, status, error) {
            closeWaitingDialog();
            //$(".loading").hide();
            //$("#divMnsj").html("");
            CallMnsj("Ha ocurrido un error al procesar su consulta (grilla). Por favor intente nuevamente.");
        },
        gridComplete: function () {
            ;
            var ids = $("#divGrid").jqGrid('getDataIDs');
            for (var i = 0; i < ids.length; i++) {
                var cl = ids[i];
                var id = $("#divGrid").jqGrid('getRowData', cl).Codigo;
                var fl = $("#divGrid").jqGrid('getRowData', cl).FlagSig;
                var row = $("#divGrid").jqGrid('getRowData', cl);
                var be = "";
                if (fl == "1") {
                    be = "<img src='img/iconGlobe.gif' style='cursor:pointer;' title='Ver en el mapa...' class='imgBut' onclick='javascript:CallMap(\"" + id + "\");' />";
                }
                $("#divGrid").jqGrid('setRowData', ids[i], { act: be });
            }

            $(".loading").hide();
            var val = $('#hdnFlag').val();
            if (val == "0") {
                $('#divFilter').hide();
                $('#divData').show();
            }
            $('#hdnFlag').val("1");
            closeWaitingDialog();
            //jQuery(".ui-jqgrid-bdiv").css('height', jQuery("#divGrid").css('height'));

            if ($.browser.msie) {
                $a = $(".ui-jqgrid .ui-jqgrid-bdiv");
                $a.css("padding", "0 0 15px 0");
                $a.css("overflow-y", "hidden");
            }

        }
    });
    $.extend(true, $.ui.multiselect, {
        selectedList: 30,
        locale: {
            addAll: 'Mostrar todas',
            removeAll: 'Ocultar todas',
            itemsCount: 'Columnas disponibles'
        }
    });

    $("#divGrid").jqGrid('navGrid', '#divPager', { edit: false, add: false, del: false, search: false, refresh: true }, {}, {}, {}, {}, {});

    $("#divGrid").jqGrid('navButtonAdd', '#divPager', {
        caption: "",
        buttonicon: "ui-icon-calculator",
        title: "Seleccionar columnas",
        onClickButton: function () {
            $(this).jqGrid('columnChooser',
                { width: 550, msel_opts: { dividerLocation: 0.5 }, modal: true });
            $("#colchooser_" + $.jgrid.jqID(this.id) + ' div.available>div.actions')
                .prepend('<label style="float:left;position:relative;margin-left:0.6em;top:0.6em">Buscar:</label>');
        }
    });
}
function showLinkDocumentV(cellvalue, options, rowObject){    
    if (cellvalue) {
        return "<a target=\"_blank\" href=\"http://ofi4.mef.gob.pe/appFs/ListaPIP.aspx?pip=" + rowObject[51] + "\" >SI</a>";
    } else {
        return "<a target=\"_blank\" href=\"https://ofi5.mef.gob.pe/invierte/formato/verProyectoCU/" + rowObject[51] + "\" >NO</a>";
    };
}
function showLinkBP(cellvalue, options, rowObject) {    
    if (rowObject[8] == "INVIERTE") {
        return "<a target=\"_blank\" href=\"https://ofi5.mef.gob.pe/invierte/formato/verProyectoCU/" + rowObject[1] + "\" >" + cellvalue + "</a>";
    } else {
        return "<a target=\"_blank\" href=\"http://ofi4.mef.gob.pe/bp/ConsultarPIP/frmConsultarPIP.asp?&accion=consultar&txtCodigo=" + rowObject[1] + "\" >" + cellvalue + "</a>";
    };
}
function CallMap(id) {
    var url = "" + id;
    var $dialog = $('<div style="padding:10px;"></div>')
    .html('<iframe style="border: 0px; " src="http://sig.mef.gob.pe/w2/Mapas/MapaPortal.aspx?codigo_snip=' + url + '" width="600" height="500"></iframe>')
    .dialog({
        autoOpen: false,
        modal: true,
        height: 'auto',
        width: 'auto',
        autoResize: true,
        title: "PIP: " + id
    });
    $dialog.dialog('open');
}

/*****************************************************************************/
function LLenaCombos() {

    CallAjax({
        url: "/invierte/general/traeListaDepartamento",
        success: FindUbigeoDpto
    });


    CallAjax({
        url: "/invierte/general/traeListaSector",
        success: FindGnSector
    });

    CallAjax({
        url: "/invierte/ConsultaPublica/traeListaMancomunidad",
        success: FindGlManPliego
    });

}
//-----UBIGEO-----//

function FindUbigeoDpto(result) {

    if (result) {
        var lista = eval(result);
        if ((lista).length == 0) {
            $("#divMnsj").html("No se encontraron departamentos.");
            CallMnsj();
        } else {
            vmConsulta.ListaDepartamentos = result.filter(function (x) { return x.ID_DEPARTAMENTO != 99; });
            lista = vmConsulta.ListaDepartamentos;
            var cbo = document.getElementById("cboDpto");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un departamento');
            cbo.options[0].value = 0;
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_DEPARTAMENTO;
            }

            $('#cboDpto').bind('change', function () {
                var prov = document.getElementById("cboProv");
                prov.options.length = 0;
                prov.options[0] = new Option('Procesando...');
                prov.options[0].value = 0;
                var dist = document.getElementById("cboDist");
                dist.options.length = 0;
                dist.options[0] = new Option('Procesando...');
                dist.options[0].value = 0;
                //var url = 'wsConsulta.asmx/ListarUbigeoProv';
                var val = $(this).val();
                if (val == 0) {
                    var prov = document.getElementById("cboProv");
                    prov.options.length = 0;
                    prov.options[0] = new Option('Seleccione una provincia');
                    prov.options[0].value = 0;
                    var dist = document.getElementById("cboDist");
                    dist.options.length = 0;
                    dist.options[0] = new Option('Seleccione un distrito');
                    dist.options[0].value = 0;
                }
                else {
                    //var data = { codigo: val };
                    //CallAjax("POST", url, JSON.stringify(data), "json", FindUbigeoProv, FindRegistroErr);
                    CallAjax({
                        url: "/invierte/general/traeListaProvincia",
                        data: { COD_DEPARTAMENTO: val },
                        success: FindUbigeoProv
                    });
                }
            });

            FindGrPliego();
            FindGlDpto();
        }
    }
}
function FindUbigeoProv(result) {
    if (result) {
        var lista = eval(result);
        if ((lista).length == 0) {
            $("#divMnsj").html("No se encontraron provincia.");
            CallMnsj();
        } else {
            var cbo = document.getElementById("cboProv");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione una provincia');
            cbo.options[0].value = 0;
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_PROV;
            }
            cbo = document.getElementById("cboDist");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un distrito');
            cbo.options[0].value = 0;

            $('#cboProv').bind('change', function () {
                var dist = document.getElementById("cboDist");
                dist.options.length = 0;
                dist.options[0] = new Option('Procesando...');
                dist.options[0].value = 0;
                //var url = 'wsConsulta.asmx/ListarUbigeoDist';
                var val = $(this).val();
                //var data = { codigo: val };
                if (val == 0) {
                    var dist = document.getElementById("cboDist");
                    dist.options.length = 0;
                    dist.options[0] = new Option('Seleccione un distrito');
                    dist.options[0].value = 0;
                } else {
                    //CallAjax("POST", url, JSON.stringify(data), "json", FindUbigeoDist, FindRegistroErr);
                    //CallAjax({
                    //    url: "/invierte/general/traeListaDistrito",
                    //    data: { COD_PROVINCIA: val, COD_DEPARTAMENTO: $("#cboDpto").val() },
                    //    success: FindUbigeoDist
                    //});
                    CallAjax({
                        url: "/invierte/ConsultaPublica/traeListaDistrito",
                        data: { ID_PROVINCIA: val },
                        success: FindUbigeoDist
                    });
                }

            });
        }
    }
}
function FindUbigeoDist(result) {

    if (result) {
        var lista = eval(result);
        if ((lista).length == 0) {
            $("#divMnsj").html("No se encontraron distrito.");
            CallMnsj();
        } else {
            var cbo = document.getElementById("cboDist");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un distrito');
            cbo.options[0].value = 0;
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_DIST;
            }
        }
    }
}


//-----SECTOR-----//
function FindGnSector(result) {
    if (result) {

        if (result.length == 0) {
            CallMnsj("No se encontraron sectores.");
        } else {

            var lista = result.filter(function (x) { return x.SECTOR_ODI != 96 && x.SECTOR_ODI != 97 });
            var cbo = document.getElementById("cboGNSect");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un Sector');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].DESCRIP_SECTOR);
                cbo.options[i + 1].value = lista[i].SECTOR_ODI;
            }
            //$('#cboGNSect').bind('change', function () {
            //    var val = $(this).val();
            //    if (val == "*") {
            //        var cmb = document.getElementById("cboGNPlie");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Seleccione una Entidad');
            //        cmb.options[0].value = "*";
            //        cmb = document.getElementById("cboGNUF");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
            //        cmb.options[0].value = "*";
            //    } else {
            //        var cmb = document.getElementById("cboGNPlie");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Procesando...');
            //        cmb.options[0].value = "*";
            //        cmb = document.getElementById("cboGNUF");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Procesando...');
            //        cmb.options[0].value = "*";

            //        CallAjax({
            //            url: "/invierte/general/traeListaPliego",
            //            data: { sector: val },
            //            success: FindGnPliego
            //        });
            //    }
            //});
        }
    }
}
//-----PLIEGO-----//
//function FindGnPliego(result) {
//    if (result) {

//        if (result.length == 0) {
//            CallMnsj("No se encontraron pliegos.");
//        } else {

//            var lista = result;
//            var cbo = document.getElementById("cboGNPlie");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Entidad');
//            cbo.options[0].value = "*";
//            for (var i = 0; i < lista.length; i++) {
//                cbo.options[i + 1] = new Option(lista[i].DESCRIP_PLIEGO);
//                cbo.options[i + 1].value = lista[i].PLIEGO_ODI;
//            }
//            cbo = document.getElementById("cboGNUF");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
//            cbo.options[0].value = "*";

//            $('#cboGNPlie').unbind('change').bind('change', function () {
//                var val = $(this).val();
//                if (val == "*") {
//                    var cmb = document.getElementById("cboGNUF");
//                    cmb.options.length = 0;
//                    cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
//                    cmb.options[0].value = "*";
//                }
//                else {
//                    var cmb = document.getElementById("cboGNUF");
//                    cmb.options.length = 0;
//                    cmb.options[0] = new Option('Procesando...');
//                    cmb.options[0].value = "*";
//                    var sec = $('#cboGNSect').val();

//                    CallAjax({
//                        url: "/invierte/ConsultaPublica/traeListaUnidadFormuladora",
//                        data: { SECTOR_ODI: sec, PLIEGO_ODI: val },
//                        success: FindGnUf
//                    });
//                }
//            });
//        }
//    }
//}
//-----UNIDAD FORMULADORA-----//
//function FindGnUf(result) {
//    if (result) {

//        if (result.length == 0) {
//            CallMnsj("No se encontraron unidades formuladoras.");
//        } else {

//            var lista = result;
//            var cbo = document.getElementById("cboGNUF");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
//            cbo.options[0].value = "*";
//            for (var i = 0; i < lista.length; i++) {
//                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
//                cbo.options[i + 1].value = lista[i].UNIDAD;
//            }
//        }
//    }
//}

//-----UNIDAD FORMULADORA-GOBIERNOS REGIONALES-----//
function FindGrPliego() {
    var result = vmConsulta.ListaDepartamentos;
    if (result) {

        if (result.length == 0) {

            CallMnsj("No se encontraron gobiernos regionales.");
        } else {
            var lista = result;
            var cbo = document.getElementById("cboGR");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un Gobierno Regional');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option("GOBIERNO REGIONAL " + lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_DEPARTAMENTO;
            }
            //$('#cboGR').bind('change', function () {
            //    var val = $(this).val();
            //    if (val == "*") {
            //        var cmb = document.getElementById("cboGRUf");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
            //        cmb.options[0].value = "*";
            //    }
            //    else {
            //        var uf = document.getElementById("cboGRUf");
            //        uf.options.length = 0;
            //        uf.options[0] = new Option('Procesando...');
            //        uf.options[0].value = "*";

            //        CallAjax({
            //            url: "/invierte/ConsultaPublica/traeListaUnidadFormuladora",
            //            data: { ID_DPTO: val },
            //            success: FindGrUf
            //        });
            //    }
            //});
        }
    }
}
//function FindGrUf(result) {
//    if (result) {

//        if (result.length == 0) {
//            CallMnsj("No se encontraron unidades formuladoras.");
//        } else {
//            var lista = result;
//            var cbo = document.getElementById("cboGRUf");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
//            cbo.options[0].value = "*";
//            for (var i = 0; i < lista.length; i++) {
//                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
//                cbo.options[i + 1].value = lista[i].UNIDAD;
//            }
//        }
//    }
//}

//-----UNIDAD FORMULADORA-GOBIERNOS LOCALES-----//
function FindGlDpto() {
    var result = vmConsulta.ListaDepartamentos;
    if (result) {

        if (result.length == 0) {
            CallMnsj("No se encontraron departamentos.");
        } else {
            var lista = result;
            var cbo = document.getElementById("cboGLDpto");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione un departamento');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_DEPARTAMENTO;
            }
            $('#cboGLDpto').bind('change', function () {
                var val = $(this).val();
                if (val == "*") {
                    var cmb = document.getElementById("cboGLProv");
                    cmb.options.length = 0;
                    cmb.options[0] = new Option('Seleccione una municpalidad provincial');
                    cmb.options[0].value = "*";

                    cmb = document.getElementById("cboGLDist");
                    cmb.options.length = 0;
                    cmb.options[0] = new Option('Seleccione una municipalidad distrital');
                    cmb.options[0].value = "*";
                    //cmb = document.getElementById("cboGLUf");
                    //cmb.options.length = 0;
                    //cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
                    //cmb.options[0].value = "*";
                }
                else {
                    var prov = document.getElementById("cboGLProv");
                    prov.options.length = 0;
                    prov.options[0] = new Option('Procesando...');
                    prov.options[0].value = "*";
                    var plie = document.getElementById("cboGLDist");
                    plie.options.length = 0;
                    plie.options[0] = new Option('Procesando...');
                    plie.options[0].value = "*";
                    //var uf = document.getElementById("cboGLUf");
                    //uf.options.length = 0;
                    //uf.options[0] = new Option('Procesando...');
                    //uf.options[0].value = "*";


                    CallAjax({
                        url: "/invierte/general/traeListaProvincia",
                        data: { COD_DEPARTAMENTO: val },
                        success: FindGlProv
                    });
                }
            });
        }
    }
}
function FindGlProv(result) {
    if (result) {

        if (result.length == 0) {
            CallMnsj("No se encontraron municipalidades provinciales.");
        } else {
            var lista = result;
            var cbo = document.getElementById("cboGLProv");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione una municipalidad provincial');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option("MUNICIPALIDAD PROVINCIAL DE " + lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_PROV;
            }
            cbo = document.getElementById("cboGLDist");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione una municipalidad distrital');
            cbo.options[0].value = "*";
            //cbo = document.getElementById("cboGLUf");
            //cbo.options.length = 0;
            //cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
            //cbo.options[0].value = "*";
            $('#cboGLProv').unbind('change').bind('change', function () {
                var val = $(this).val();
                if (val == "*") {
                    var cmb = document.getElementById("cboGLDist");
                    cmb.options.length = 0;
                    cmb.options[0] = new Option('Seleccione una municipalidad distrital');
                    cmb.options[0].value = "*";
                    //cmb = document.getElementById("cboGLUf");
                    //cmb.options.length = 0;
                    //cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
                    //cmb.options[0].value = "*";
                }
                else {
                    var plie = document.getElementById("cboGLDist");
                    plie.options.length = 0;
                    plie.options[0] = new Option('Procesando...');
                    plie.options[0].value = 0;

                    CallAjax({
                        url: "/invierte/ConsultaPublica/traeListaDistrito",
                        data: { ID_PROVINCIA: val },
                        success: FindGlPlie
                    });

                    //var uf = document.getElementById("cboGLUf");
                    //uf.options.length = 0;
                    //uf.options[0] = new Option('Procesando...');
                    //uf.options[0].value = 0;

                    //CallAjax({
                    //    url: "/invierte/ConsultaPublica/traeListaUnidadFormuladora",
                    //    data: { ID_PROV: val },
                    //    success: FindGlUf
                    //});
                }
            });
        }
    }
}
function FindGlPlie(result) {
    if (result) {

        if (result.length == 0) {
            $("#divMnsj").html("No se encontraron municipalidades distritales.");
            CallMnsj();
        } else {
            var lista = result;
            var cbo = document.getElementById("cboGLDist");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione una municipalidad distrital');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option("MUNICIPALIDAD DISTRITAL DE " + lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].ID_DIST;
            }
            //cbo = document.getElementById("cboGLUf");
            //cbo.options.length = 0;
            //cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
            //cbo.options[0].value = "*";
            //$('#cboGLDist').unbind('change').bind('change', function () {
            //    var val = $(this).val();
            //    if (val == "*") {
            //        var cmb = document.getElementById("cboGLUf");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
            //        cmb.options[0].value = "*";
            //    }
            //    else {
            //        var uf = document.getElementById("cboGLUf");
            //        uf.options.length = 0;
            //        uf.options[0] = new Option('Procesando...');
            //        uf.options[0].value = "*";

            //        CallAjax({
            //            url: "/invierte/ConsultaPublica/traeListaUnidadFormuladora",
            //            data: { ID_DIST: val },
            //            success: FindGlUf
            //        });

            //    }
            //});
        }
    }
}
//function FindGlUf(result) {
//    if (result) {

//        if (result.length == 0) {
//            CallMnsj("No se encontraron unidades formuladoras.");
//        } else {
//            var lista = result;
//            var cbo = document.getElementById("cboGLUf");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
//            cbo.options[0].value = "*";
//            for (var i = 0; i < lista.length; i++) {
//                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
//                cbo.options[i + 1].value = lista[i].UNIDAD;
//            }
//        }
//    }
//}

//-----MANCOMUNIDADES-----//
function FindGlManPliego(result) {
    if (result) {
        var lista = eval(result);
        if ((lista).length == 0) {
            CallMnsj("No se encontraron mancomunidades.");
        } else {
            var cbo = document.getElementById("cboGLManPlie");
            cbo.options.length = 0;
            cbo.options[0] = new Option('Seleccione una mancomunidad');
            cbo.options[0].value = "*";
            for (var i = 0; i < lista.length; i++) {
                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
                cbo.options[i + 1].value = lista[i].IDMANCOMUNIDAD;
            }

            //COMENTADO 25/05/2018 - YA NO SE FILTRA POR UNIDAD FORMULADORA
            //cbo = document.getElementById("cboGLManUf");
            //cbo.options.length = 0;
            //cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
            //cbo.options[0].value = "*";
            //$('#cboGLManPlie').bind('change', function () {
            //    var val = $(this).val();
            //    if (val == "*") {
            //        var cmb = document.getElementById("cboGLManUf");
            //        cmb.options.length = 0;
            //        cmb.options[0] = new Option('Seleccione una Unidad Formuladora');
            //        cmb.options[0].value = "*";
            //    }
            //    else {
            //        var uf = document.getElementById("cboGLManUf");
            //        uf.options.length = 0;
            //        uf.options[0] = new Option('Procesando...');
            //        uf.options[0].value = "*";

            //        CallAjax({
            //            url: "/invierte/ConsultaPublica/traeListaUnidadFormuladora",
            //            data: { IDMANCOMUNIDAD: val },
            //            success: FindGlManUf
            //        });
            //    }
            //});
        }
    }
}
//function FindGlManUf(result) {
//    if (result) {
//        var lista = eval(result);
//        if ((lista).length == 0) {
//            CallMnsj("No se encontraron unidades formuladoras.");
//        } else {
//            var cbo = document.getElementById("cboGLManUf");
//            cbo.options.length = 0;
//            cbo.options[0] = new Option('Seleccione una Unidad Formuladora');
//            cbo.options[0].value = "*";
//            for (var i = 0; i < lista.length; i++) {
//                cbo.options[i + 1] = new Option(lista[i].NOMBRE);
//                cbo.options[i + 1].value = lista[i].UNIDAD;
//            }
//        }
//    }
//}

function FindFuncion(result) {
    $("#cboFuncion").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    if (result) {
        var lista = result;
        if (lista.length == 0) {
            CallMnsj("No se encontraron funciones.");
        } else {
            //var data = $.parseJSON(lista);
            var data = lista;
            $.each(data, function (index, item) {
                $("#cboFuncion").append($("<option/>").attr("value", item.COD_FUNCION).text(item.DES_FUNCION));
            });
        }
    }
}
function FindDivision(result) {
    $("#cboDivision").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    if (result) {
        var lista = result;
        if (lista.length != 0) {
            //var data = $.parseJSON(lista);
            var data = lista;
            $.each(data, function (index, item) {
                $("#cboDivision").append($("<option/>").attr("value", item.COD_PROGRAMA).text(item.DES_PROGRAMA));
            });
        }
    }
}
function FindGrupo(result) {
    $("#cboGrupo").empty().append($("<option/>").attr("value", "0").text("Seleccione"));
    if (result) {
        var lista = result;
        if (lista.length != 0) {
            var data = lista;
            $.each(data, function (index, item) {
                $("#cboGrupo").append($("<option/>").attr("value", item.COD_SUB_PROGRAMA).text(item.DES_SUB_PROGRAMA));
            });
        }
    }
}
/*****************************************************************************/
function Show(id) {
    var txt = "";
    if (id == 'tblUbigeo') {
        if ($('#cboDpto').val() > 0)
            txt = $("option:selected", $('#cboDpto')).text();
        if ($('#cboProv').val() > 0)
            txt = txt + ' - ' + $("option:selected", $('#cboProv')).text();
        if ($('#cboDist').val() > 0)
            txt = txt + ' - ' + $("option:selected", $('#cboDist')).text();
    }
    if ($('#' + id).is(":visible")) {
        $('#' + id).hide();
        $('#' + id).next().show();
        $('#' + id).next().text('Ha seleccionado: ' + txt);
    }
    else {
        $('#' + id).show();
        $('#' + id).next().hide();
    }
}

/*****************************************************************************/
function CallAjax(option) {

    option.type = option.type == undefined ? 'POST' : option.type,
    option.async = option.async == undefined ? true : option.async,
    option.dataType = option.dataType == undefined ? 'json' : option.dataType,
    option.contentType = option.contentType == undefined ? 'application/json; charset=utf-8' : option.contentType;

    $.ajax({
        type: option.type,
        url: option.url,
        async: option.async,
        dataType: option.dataType,
        contentType: option.contentType,
        data: JSON.stringify(option.data),
        beforeSend: function () {
            $(".loading").show();
            waitingDialog({});
        },
        success: function (response) {

            if (typeof option.success === "function") {
                option.success(response);
            }

        },
        error: function (jqXHR, error, errorThrown) {
            closeWaitingDialog();
            CallMnsj("Ha ocurrido un error al procesar su consulta. Por favor intente nuevamente.");
        },
        complete: function () {
            //$(".loading").hide();
            closeWaitingDialog();
        }
    });
};
function waitingDialog(waiting) { // I choose to allow my loading screen dialog to be customizable, you don't have to
    $("#divLoad").html(waiting.message && '' != waiting.message ? waiting.message : 'Espere mientras se procesa su consulta...');
    $("#divLoad").dialog('option', 'title', waiting.title && '' != waiting.title ? waiting.title : 'Procesando');
    $("#divLoad").dialog('open');
}
function closeWaitingDialog() {
    $(".loading").hide();
    $("#divLoad").dialog('close');
}
function CallMnsj(msg) {
    if (msg != "") {
        $("#divMnsj").html(msg);
    }
    $("#dialog:ui-dialog").dialog("destroy");
    $("#divMnsj").dialog({
        modal: true,
        dialogClass: "loadingScreenWindow",
        closeOnEscape: false,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
};
$.fn.ParseDataToJqGrid = function (data) {

    var idColumns = $(this).getGridParam('jsonReader').id;
    var colModel = $(this).getGridParam('colModel');
    var resultData = {
        totalpages: data.TotalPage
        , totalrecords: data.TotalRows
        , page: $(this).getGridParam('page')
        , rows: []
    };
    data.Data.forEach(function (item) {
        var i = item[idColumns].toString();
        var cell = [];

        colModel.forEach(function (column) {
            if (item[column.name] !== undefined) {

                if (item[column.name] !== null) {
                    var valCell = item[column.name].toString() + '';
                    if (valCell.indexOf("/Date") === 0) 
                        cell.push(ParseJsonToString(valCell));
                     else 
                        cell.push(valCell);
                } else {
                    cell.push("");
                }
            }
        });

        resultData.rows.push({
            i: i,
            cell: cell
        });
    });
    
    var grid = $(this)[0];
    grid.addJSONData(resultData);

};
function ParseJsonToString(dateJson) {

    if (dateJson != null && dateJson != "") {
        var parsedDate = new Date(parseInt(dateJson.substr(6)));
        var day = parsedDate.getDate();
        var month = parsedDate.getMonth() + 1;
        var year = parsedDate.getFullYear();
        return [day < 10 ? "0" + day : day, month < 10 ? "0" + month : month, year].join("/");
    } else {
        return "";
    }

}
function DescargarConsultaAvanzada(params) {
    waitingDialog({ message: "Descargando archivo excel" });
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 2) {
            if (xhr.getResponseHeader("Content-Type") != null) {
                if (xhr.getResponseHeader("Content-Type").indexOf("application/json") >= 0) {
                    xhr.responseType = "json";
                }
            }

        }
    };
    xhr.onload = function () {

        if (xhr.status === 200) {

            if (xhr.responseType == "json") {
                closeWaitingDialog();
                $("#divMnsj").html("Ocurrió un error al descargar el archivo excel. Por favor intente nuevamente.<br/><br/>Si el error persiste contacte al administrador");
                CallMnsj();
            } else {
                var filename = "";
                var disposition = xhr.getResponseHeader('Content-Disposition');
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                }

                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
                a.download = filename; // Set the file name.
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                delete a;
                closeWaitingDialog();
            }


        } else {
            closeWaitingDialog();
            $("#divMnsj").html("Ocurrió un error al descargar el archivo excel. Por favor intente nuevamente.<br/><br/>Si el error persiste contacte al administrador");
            CallMnsj();
        }

    };
    xhr.onerror = function () {

        closeWaitingDialog();
        $("#divMnsj").html("Ocurrió un error al descargar el archivo excel. Por favor intente nuevamente.<br/><br/>Si el error persiste contacte al administrador");
        CallMnsj();

    };

    xhr.open('POST', "/invierte/ConsultaPublica/exportarProyectoConsultaAvanzada", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(params));
    //******************///
};