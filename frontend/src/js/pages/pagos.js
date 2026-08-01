document.addEventListener('DOMContentLoaded', () => {
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const cardForm = document.getElementById('card-form');
    const submitBtn = document.getElementById('submit-payment');
    const successModal = document.getElementById('success-modal');

    // Toggle forms based on payment method
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });

    // Handle submit
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.addEventListener('click', () => {
            // Simulate processing
            submitBtn.innerHTML = '<span class="opacity-70">Procesando...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success modal
                successModal.classList.remove('hidden');
                successModal.classList.add('flex');
                
                // Trigger reflow for transition
                void successModal.offsetWidth;
                
                successModal.classList.remove('opacity-0');
                successModal.querySelector('div').classList.remove('scale-95');
                successModal.querySelector('div').classList.add('scale-100');
            }, 1500);
        });
    }
});
