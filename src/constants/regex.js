  // Regular expression source patterns.
  var REGS = {

    // Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY]
    arabicDateDMY: /(?=\D?)(31|30|(?:0[1-9]|[1-2][0-9]))(\/|\.|-)(12|11|10|0[1-9])(\2)(\d{4}|\d{2})(?=\D?)/,

    // Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY]
    arabicDateMDY: /(?=\D?)(12|11|10|0[1-9])(\/|\.|-)(31|30|(?:0[1-9]|[1-2][0-9]))(\2)(\d{4}|\d{2})(?=\D?)/,

    // Arabic tatweel.
    arabicTatweel: /\u0640+/,

    // Number with decimal separator
    numberWithDecimal: /(?:^|[^\d.])(\d+\.\d+)(?![.\d])/,

    // Number with decimal and thousand separators.
    numberWithDecimalThousand: /(?:^|[^\d.])(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?(?!\.)(?!\d)/,
  };
