document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-toggle-password]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'HIDE' : 'SHOW';
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  document.querySelectorAll('.otp-grid').forEach((grid) => {
    const fields = [...grid.querySelectorAll('input')];
    fields.forEach((field, index) => {
      field.addEventListener('input', () => {
        field.value = field.value.replace(/\D/g, '').slice(-1);
        if (field.value && fields[index + 1]) fields[index + 1].focus();
      });
      field.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && !field.value && fields[index - 1]) fields[index - 1].focus();
      });
      field.addEventListener('paste', (event) => {
        const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, fields.length);
        if (!pasted) return;
        event.preventDefault();
        pasted.split('').forEach((digit, i) => { if (fields[i]) fields[i].value = digit; });
        fields[Math.min(pasted.length, fields.length - 1)].focus();
      });
    });
  });

  document.querySelectorAll('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const notice = form.querySelector('.notice');
      if (notice) {
        notice.textContent = form.dataset.message || 'Form validated. Connect this form to your backend to complete authentication.';
        notice.className = 'notice success show';
      }
    });
  });
});
