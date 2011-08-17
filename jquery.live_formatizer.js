(function() {
  var cleanInput, countDots, non_mutating_key_codes;
  non_mutating_key_codes = [13, 37, 39];
  countDots = function(value) {
    var r, str;
    str = "[^" + I18n.t('number.format.delimiter') + "]";
    r = new RegExp(str, 'g');
    return value.replace(r, '').length;
  };
  cleanInput = function(element) {
    if (parseInt(element.value) !== 0) {
      element.value = element.value.replace(/^0*/g, '');
    }
    return element.value = element.value.replace(new RegExp("\\" + I18n.t('number.format.delimiter'), 'g'), "");
  };
  $(function() {
    var formatized_inputs;
    $('input.formatized').parents('form').submit(function() {
      return $(this).find('.formatized').each(function() {
        return cleanInput(this);
      });
    });
    formatized_inputs = $('input.formatized');
    formatized_inputs.each(function() {
      if (this.value) {
        return this.value = UnitHelper.formatNumber(parseInt(this.value));
      }
    });
    formatized_inputs.keydown(function() {
      return this.value_before_keypress = this.value;
    });
    return formatized_inputs.keyup(function(e) {
      var cursor_position, text_field;
      if (this.value) {
        text_field = $(this);
        cursor_position = text_field.getSelection().start;
        if (this.value !== this.value_before_keypress) {
          if (countDots(this.value) < countDots(this.value_before_keypress)) {
            if (e.keyCode === 46) {
              this.value = this.value.substr(0, cursor_position) + this.value.substr(cursor_position + 1);
              cursor_position++;
            } else if (e.keyCode === 8) {
              this.value = this.value.substr(0, cursor_position - 1) + this.value.substr(cursor_position);
            }
          }
          cleanInput(this);
          text_field.val(UnitHelper.formatNumber(parseInt(this.value)));
          cursor_position += countDots(this.value) - countDots(this.value_before_keypress);
          if (cursor_position < 0) {
            cursor_position = 0;
          }
          return text_field.setSelection(cursor_position);
        }
      }
    });
  });
}).call(this);
