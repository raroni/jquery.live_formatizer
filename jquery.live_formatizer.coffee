non_mutating_key_codes = [13, 37, 39]

countDots = (value) ->
  str = "[^" + I18n.t('number.format.delimiter') + "]"
  r = new RegExp(str, 'g')
  value.replace(r, '').length
  
cleanInput = (element) ->
  element.value = element.value.replace(/^0*/g, '') unless parseInt(element.value) == 0 # remove initial zeroes
  element.value = element.value.replace(new RegExp("\\" +I18n.t('number.format.delimiter'), 'g'), "") # remove all dots

$ ->
  $('input.formatized').parents('form').submit ->
    $(this).find('.formatized').each ->
      cleanInput this

  formatized_inputs = $('input.formatized')

  formatized_inputs.each ->
    this.value = UnitHelper.formatNumber(parseInt(this.value)) if this.value

  formatized_inputs.keydown ->
    this.value_before_keypress = this.value

  formatized_inputs.keyup (e) ->
    if this.value
      text_field = $ this
      cursor_position = text_field.getSelection().start
  
      if this.value != this.value_before_keypress
        if countDots(this.value) < countDots(this.value_before_keypress)
          if e.keyCode == 46 # delete key
            this.value = this.value.substr(0, cursor_position) + this.value.substr(cursor_position+1)
            cursor_position++
          else if e.keyCode == 8 # backspace key
            this.value = this.value.substr(0,cursor_position-1) + this.value.substr(cursor_position)

        cleanInput this
        text_field.val UnitHelper.formatNumber(parseInt(this.value))

        cursor_position += countDots(this.value) - countDots(this.value_before_keypress)
        cursor_position = 0 if cursor_position < 0
      
        text_field.setSelection cursor_position
