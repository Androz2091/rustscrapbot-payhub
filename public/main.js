(function () {
	"use strict";

	var treeviewMenu = $('.app-menu');

	// Toggle Sidebar
	$('[data-toggle="sidebar"]').click(function(event) {
		event.preventDefault();
		$('.app').toggleClass('sidenav-toggled');
	});

	// Activate sidebar treeview toggle
	$("[data-toggle='treeview']").click(function(event) {
		event.preventDefault();
		if(!$(this).parent().hasClass('is-expanded')) {
			treeviewMenu.find("[data-toggle='treeview']").parent().removeClass('is-expanded');
		}
		$(this).parent().toggleClass('is-expanded');
	});

	// Set initial active toggle
	$("[data-toggle='treeview.'].is-expanded").parent().toggleClass('is-expanded');

	//Activate bootstrip tooltips
	$("[data-toggle='tooltip']").tooltip();

    const params = new URLSearchParams(window.location.search);
    const invoiceId = params.get('invoice_id');
    const pricing = parseFloat(params.get('pricing'));
    const currency = params.get('currency');
    const feesRaw = params.get('fees');
    const fees = feesRaw ? feesRaw.split(',').map(e => parseFloat(e)) : [0,0,0,0];
    const invoiceLink = params.get('link');

    if (invoiceId) {
        $('title').text('Invoice #' + invoiceId);
        $('.user-name').text('Invoice #' + invoiceId);
    }

    if (pricing) {
        const symbol = currency === 'USD' ? '$' : '€';

        const paypal = pricing + fees[2] * pricing;
        if (fees[2] !== 0) {
            $('#paypal').append(' (' + (fees[2] * 100) + '% '+(fees[2] < 0 ? 'discount' : 'fee')+') ' + paypal  + ' ' + symbol);
        } else {
            $('#paypal').append(' ' + paypal  + ' ' + symbol);
        }

        const bankFee = fees[3];
        const bankPricing = pricing + bankFee * pricing;
        if (bankFee !== 0) {
            $('#bank').append(' (' + bankFee * 100 + '% '+(fees[3] < 0 ? 'discount' : 'fee')+') ' + bankPricing  + ' ' + symbol);
        } else {
            $('#bank').append(' ' + bankPricing  + ' ' + symbol);
        }

        const fiverrPricing = pricing + fees[1] * pricing;
        if (fees[1] !== 0) {
            $('#fiverr').append(' (' + (fees[1] * 100) + '% '+(fees[1] < 0 ? 'discount' : 'fee')+') ' + Math.ceil(fiverrPricing)  + ' ' + symbol);
        } else {
            $('#fiverr').append(' ' + fiverrPricing  + ' ' + symbol);
        }

        const creditCard = pricing + fees[0] * pricing;
        if (fees[0] !== 0) {
            $('#credit-card').append(' (' + (fees[0] * 100) + '% '+(fees[0] < 0 ? 'discount' : 'fee')+') ' + creditCard  + ' ' + symbol);
        } else {
            $('#credit-card').append(' ' + creditCard  + ' ' + symbol);
        }

        // on click
        $('#bank').on('click', (e) => {
            e.preventDefault();
        });

        $('#credit-card').on('click', (e) => {
            e.preventDefault();
            // open credit card payment
            window.open(invoiceLink);
        });

        $('#paypal').on('click', (e) => {
            e.preventDefault();
            // open paypal payment
            window.open(`https://www.paypal.com/paypalme/smnlefort/${paypal}${currency}`);
        });

        $('#fiverr').on('click', (e) => {
            e.preventDefault();
        });
    }

    $("#bank").popover();
    $("#fiverr").popover();

})();
