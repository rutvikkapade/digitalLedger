const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const unique = urlParams.get('unique');

 $(() => {

        $.ajax({
            url: "/getAll",
            method: "get",
            success: function(data) {
                all = data[0];
                businessId = all._id;
                businessName = all.b_name;
                businessMobile = all.b_mobile;
                ownerName = all.b_owner;
                businessEmail = all.b_email;
                totalClients = all.clients.length;
                delete(all);
                $('#user').text('welcome ' + ownerName + '!');
                var profile = `<div class="card">
  <h5 class="card-header">Business Profile</h5>
  <div class="card-body">
    <h5 class="card-title">` + businessName.toUpperCase() + `</h5>
    <p class="card-text">Business Id : ` + businessId + `</p>
    <p class="card-text">Owned By : ` + ownerName.toUpperCase() + `</p>
    <p class="card-text">Business Email : ` + businessEmail + `</p>
    <p class="card-text">Registered Mobile : +91-` + businessMobile + `</p>
  </div>
</div>`;
                $('#profileView').append(profile);
            }
        })

    });
    $('#addClient').click((event) => {
        $('#addClientsForm').css('display', 'block');
        $('#results').css('display', 'none');
    })
    $('#goDashBoard').click((event) => {
        $('#addClientsForm').css('display', 'none');
        $('#results').css('display', 'block');
    })
    $('#viewClients').click(() => {
        $.ajax({
            url: "/getClients",
            method: "get",
            success: (data) => {
                var clientData = `<tr>/
							<th>Client Name</th>
							<th>Client Email</th>/
							<th>Client Mobile</th>/
							<th>Number of Transactions</th>/
							<th>Action</th>/
							</tr>`;
                for (i = 0; i < data.length; i++) {
                    clientData += '<tr>';
                    clientData += '<td>' + data[i].clientName + '</td>';
                    clientData += '<td>' + data[i].clientEmail + '</td>';
                    clientData += '<td>' + data[i].clientMobile + '</td>';
                    clientData += '<td>' + data[i].clientTransactions.length + '</td>';
                    if (data[i].clientTransactions.length == 0) {
                        clientData += '<td><button id="' + i + 'table" class="btn btn-outline-secondary" disabled onclick="displayTransactions(this.id)">No Transactions So Far</button></td>';
                    } else {
                        clientData += '<td><button id="' + i + 'table" class="btn btn-outline-danger" onclick="displayTransactions(this.id)">View Transaction History</button></td>';
                    }

                    clientData += '</tr>';
                }
                $('#clientTable').append(clientData);

            }
        })
        $('#results').css('display', 'none');
        $('#allClients').css('display', 'block');
    })

    function initiateVerification(result) {
        $.ajax({
            url: "/checkValidity",
            method: "post",
            data: {
                "clientEmail": result
            },
            success: (res) => {
                if (res.isOk == false) {
                    $('#row' + res.index + '').css('background-color', '#FF9292');
                    alert('your transaction chain is Compromised !')
                } else {
                    alert('Chain Verified ! No tampering found!');

                }
            }
        })
    }

    function displayTransactions(data) {
        var index = parseInt(data, 10);
        $.ajax({
            url: "/getClients",
            method: "get",
            success: (data) => {
                var tData = `<tr>
		<th>Transaction Id</th>
		<th>TimeStamp</th>
		<th>Amount in Rupees</th>
		<th>Remarks</th>
		<th>Status</th>
		<th>Previous Hash</th>
		<th>Hash</th>
	</tr>`;
                var variable = data[index].clientTransactions;
                for (i = 0; i < variable.length; i++) {
                    tData += '<tr id="row' + i + '">';
                    tData += '<td>' + variable[i]._id + '</td>';
                    tData += '<td>' + variable[i].timeStamp + '</td>';
                    tData += '<td>' + variable[i].amount + '</td>';
                    tData += '<td>' + variable[i].remarks + '</td>';
                    tData += '<td>' + variable[i].status + '</td>';
                    tData += '<td>' + variable[i].previousHash + '</td>';
                    tData += '<td>' + variable[i].hash + '</td>';
                    tData += '</tr>';
                }
                $('#transactionTable').append(tData);
                $('#verification').append('<button id="' + data[index].clientEmail + '" onclick="initiateVerification(this.id)" class="btn btn-success">Verify Transaction Chain</button>')
            }
        })
        $('#allClients').css('display', 'none');
        $('#transactionDiv').css('display', 'block');

    }
    $('#goDashBoard2').click((event) => {
        $('#clientTable').empty();
        $('#allClients').css('display', 'none');
        $('#results').css('display', 'block');
    })
    $('#goDashBoard3').click((event) => {
        $('#verification').empty();
        $('#transactionTable').empty();
        $('#allClients').css('display', 'block');
        $('#transactionDiv').css('display', 'none');
    })
    $('#viewProfile').click((event) => {
        $('#results').css('display', 'none');
        $('#profileView').css('display', 'block');
    })
    $('#goDashBoard4').click((event) => {
        $('#results').css('display', 'block');
        $('#profileView').css('display', 'none');
    })
    $('#newTransaction').click((event) => {
        $.ajax({
            url: "/getClients",
            method: "get",
            success: (data) => {
                clientOptions = '';
                for (i = 0; i < data.length; i++) {
                    clientOptions += '<option>' + data[i].clientEmail + '</option>'
                }
                $('#clientSelect').append(clientOptions);

            }
        })
        $('#results').css('display', 'none');
        $('#requestMoney').css('display', 'block');
    })
    $('#goDashBoard5').click((event) => {
        $('#clientSelect').empty();
        $('#results').css('display', 'block');
        $('#requestMoney').css('display', 'none');
    })
    $('#clientAdd').click((event) => {
        $('#clientForm').submit();
        alert('added client succesfull!');
        $('#clientForm')[0].reset();
    })
    $('#requestPayment').click((event) => {
        $('#paymentForm').submit();
        alert('payment request sent !');
        $('#paymentForm')[0].reset();
    })