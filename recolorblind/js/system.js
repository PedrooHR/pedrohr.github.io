
/*binding functions */
$(document).ready(function()
{
    //start app
    $('#btn_Start').on('click', function(){ $("#HomePage").toggleClass('d-none'); $("#MenuPage").toggleClass('d-none') });
    //máscara real
    $(".MoneyInput").maskMoney({prefix:'R$ ', thousands:'.',decimal:','}); 
    //menu icon display
    $('.collapse').on('shown.bs.collapse', function(){ $(this).parent().find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");})
                  .on('hidden.bs.collapse', function(){ $(this).parent().find(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");});
    //troca de pagina
    $('.GoPage').on('click', function(ev){ resetContainer(ev.target.dataset.target) });
    //requisicoes
    $('#btn_ChkMotorista').on('click', function(ev){ HTTP_GET('getMotoristas') });
    $('#btn_ChkPassageiro').on('click', function(ev){ HTTP_GET('getPassageiros') });
    $('#btn_ChkCorrida').on('click', function(ev){ HTTP_GET('getCorridas') });
    

});

function attTable(dados, target){
    let table = document.getElementById(target); //binda body da table
    table.innerHTML = '';
    for (let i = 0; i < dados.length; i++){
        let htmlrow = `<tr id="` + target + i + `"><th scope="row"> ` + (i+1) + `</td>`;
        let data = Object.values(dados[i]);
        for (let j = 1; j < data.length; j++)
            htmlrow += `<td>` + data[j] + `</td> `;
        htmlrow += '</tr>';
        table.innerHTML += htmlrow;
    }
    for (let i = 0; i < dados.length; i++){
        $("#" + target + i).on('click', function(){ 
            bindModal(target, i);
            $("#msgsModal").modal('show');
        });
    }
}

function bindModal(target, i){
    let elements = $("#" + target + i).toArray()[0].children;
    switch (target){
        case 'chkMotoristaBody':
            let aux = (elements[elements.length-1].textContent == "Ativo") ? "Inativo" : "Ativo";
            $("#modalTarget").html(target);
            $("#modalTargeti").html(i);
            $("#modalTitle").text("Opções para o(a) motorista " + elements[1].textContent);
            $("#modalBody").html(`Opção de Atividade: <select class="custom-select" id="modalSelect" required>
                                    <option value="` + elements[elements.length-1].textContent + `" selected>` + elements[elements.length-1].textContent + `</option>
                                    <option value="` + aux + `"> ` + aux + `</option> 
                                  </select>`);
            $("#modalBody").append(`Deletar motorista: <input type="checkbox" id="modalCheckBox">`);
            break;
        case 'chkPassageiroBody':
            $("#modalTarget").html(target);
            $("#modalTargeti").html(i);
            $("#modalTitle").text("Opções para o(a) passageiro " + elements[1].textContent);
            $("#modalBody").html(`Deletar passageiro: <input type="checkbox" id="modalCheckBox">`);
            break;
        case 'chkCorridaBody':
            $("#modalTarget").html(target);
            $("#modalTargeti").html(i);
            $("#modalTitle").text("Opções para a corrida " + elements[0].textContent);
            $("#modalBody").html(`Deletar corrida: <input type="checkbox" id="modalCheckBox">`);
            break;
        default:
            break;
    } 
}

function salvaModal(){
    let target = document.getElementById('modalTarget').innerHTML;
    let i = document.getElementById('modalTargeti').innerHTML;
    let delOpt = document.getElementById('modalCheckBox').checked; 
    if (target == 'chkMotoristaBody'){
        let status = document.getElementById('modalSelect').value;
        updateRow(target, i, [delOpt, status]);
    } else {
        updateRow(target, i, [delOpt]);
    }
}

function updateRow(target, i, options){
    if(options[0]){
        let nome, tipo;
        if (target == 'chkCorridaBody'){
            nome = [$("#" + target + i).toArray()[0].children[1].textContent, $("#" + target + i).toArray()[0].children[2].textContent];
            tipo = 'Corridas';
        } else if (target == 'chkMotoristaBody') {
            nome = [$("#" + target + i).toArray()[0].children[1].textContent];
            tipo = 'Motoristas';
        } else {
            nome = [$("#" + target + i).toArray()[0].children[1].textContent];
            tipo = 'Passageiros';
        }
        HTTP_POST({rota: "deleteRow", body: {tipo: tipo, dados: nome}});

    } 
    if (options.length > 1){
        let nome = $("#" + target + i).toArray()[0].children[1].textContent;
        HTTP_POST({rota: "updateRow", body: {tipo: "Motoristas", dados: {nome:nome, status: options[1] }}});
    }
}

function resetContainer(x)
{
    let container = document.getElementById('frameContent');    
    for (let i = 0; i < container.children.length; i++){
        if (x == container.children[i].title)
            container.children[i].classList.remove('d-none');
        else
            container.children[i].classList.add('d-none');
    }
}

function cadMotorista(){
    let validate = true;
    document.getElementById('status_msg_m').innerText = '';
    document.getElementById('sexo_msg_m').innerText = '';
    document.getElementById('cpf_msg_m').innerText = '';
    let nome = document.getElementById('form_motorista_nome').value;
    let CPF = document.getElementById('form_motorista_cpf').value;
    let dataNasc = document.getElementById('form_motorista_dn').value;
    let carModel = document.getElementById('form_motorista_modelo').value;
    let sexo = document.getElementById('form_motorista_sexo').value;
    let status = document.getElementById('form_motorista_status').value;

    if(status != 'Ativo' && status != 'Inativo'){
        document.getElementById('status_msg_m').innerText = "Por favor, escolha uma opção.";
        validate = false;
    }
    if(sexo != 'Masculino' && sexo != 'Feminino' && sexo != 'Não Informado'){
        document.getElementById('sexo_msg_m').innerText = "Por favor, escolha uma opção.";
        validate = false;
    }
    if (!TestaCPF(CPF)){
        document.getElementById('cpf_msg_m').innerText = "Por favor, insira um CPF válido.";
        validate = false;
    }

    let newMotorista = {nome: nome, CPF: CPF, dataNasc: dataNasc, carModel: carModel, sexo: sexo, status: status};

    if(validate)
        HTTP_POST({rota: "realizaCadastro", body: {tipo: "Motoristas", dados: newMotorista}});
}

function cadPassageiro(){
    let validate = true;
    document.getElementById('sexo_msg_p').innerText = '';
    document.getElementById('cpf_msg_p').innerText = '';
    let nome = document.getElementById('form_passageiro_nome').value;
    let CPF = document.getElementById('form_passageiro_cpf').value;
    let dataNasc = document.getElementById('form_passageiro_dn').value;
    let sexo = document.getElementById('form_passageiro_sexo').value;

    if(sexo != 'Masculino' && sexo != 'Feminino' && sexo != 'Não Informado'){
        document.getElementById('sexo_msg_p').innerText = "Por favor, escolha uma opção.";
        validate = false;
    }
    if (!TestaCPF(CPF)){
        document.getElementById('cpf_msg_p').innerText = "Por favor, insira um CPF válido.";
        validate = false;
    }

    let newPassageiro = {nome: nome, CPF: CPF, dataNasc: dataNasc, sexo: sexo};

    if(validate)
        HTTP_POST({rota: "realizaCadastro", body: {tipo: "Passageiros", dados: newPassageiro}});
}

function cadCorrida(){
    let passageiro = document.getElementById('form_corrida_passageiro').value;
    let motorista = document.getElementById('form_corrida_motorista').value;
    let valor = document.getElementById('form_corrida_valor').value;
    
    let newCorrida = {motorista: motorista, passageiro: passageiro, valor:valor};
        
    HTTP_POST({rota: "cadastraCorrida", body: {tipo: "Corridas", dados: newCorrida}});
}

function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;
     
    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
     
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
     
    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
     
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

function HTTP_POST(x){
    var xhttp = new XMLHttpRequest();
    let query = x.rota;
    xhttp.open("POST", query , true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let resposta = JSON.parse(xhttp.responseText);
            switch (resposta.tipo){
                case 'STATUS':
                        alert(resposta.msg);
                    break;
            }
        };
    };
    xhttp.send(JSON.stringify(x.body));
}

function HTTP_GET(x){
    var xhttp = new XMLHttpRequest();
    let query = x;
    xhttp.open("GET", query , true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let resposta = JSON.parse(xhttp.responseText);
            switch (resposta.tipo){
                case 'getMotoristas':
                    attTable(resposta.dados, 'chkMotoristaBody');
                    break;

                case 'getPassageiros':
                    attTable(resposta.dados, 'chkPassageiroBody');
                    break;

                case 'getCorridas':
                    attTable(resposta.dados, 'chkCorridaBody');
                    break;
            }
        }
    };
    xhttp.send();
}