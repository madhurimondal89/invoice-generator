export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country?: string;
}

export const CURRENCIES: Currency[] = [
  // Major currencies
  { code: "USD", name: "US Dollar", symbol: "$", country: "United States" },
  { code: "EUR", name: "Euro", symbol: "€", country: "European Union" },
  { code: "GBP", name: "British Pound", symbol: "£", country: "United Kingdom" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", country: "Japan" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", country: "Switzerland" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", country: "Canada" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", country: "Australia" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", country: "China" },
  
  // Asian currencies
  { code: "INR", name: "Indian Rupee", symbol: "₹", country: "India" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", country: "South Korea" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", country: "Singapore" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", country: "Hong Kong" },
  { code: "THB", name: "Thai Baht", symbol: "฿", country: "Thailand" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", country: "Malaysia" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", country: "Indonesia" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", country: "Philippines" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", country: "Vietnam" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", country: "Taiwan" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", country: "Pakistan" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", country: "Bangladesh" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", country: "Sri Lanka" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", country: "Nepal" },
  { code: "MMK", name: "Myanmar Kyat", symbol: "K", country: "Myanmar" },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", country: "Cambodia" },
  { code: "LAK", name: "Lao Kip", symbol: "₭", country: "Laos" },
  { code: "BND", name: "Brunei Dollar", symbol: "B$", country: "Brunei" },
  
  // European currencies
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", country: "Norway" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", country: "Sweden" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", country: "Denmark" },
  { code: "ISK", name: "Icelandic Krona", symbol: "kr", country: "Iceland" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", country: "Poland" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", country: "Czech Republic" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", country: "Hungary" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", country: "Romania" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", country: "Bulgaria" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", country: "Croatia" },
  { code: "RSD", name: "Serbian Dinar", symbol: "дин", country: "Serbia" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", country: "Ukraine" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", country: "Russia" },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", country: "Belarus" },
  { code: "MDL", name: "Moldovan Leu", symbol: "L", country: "Moldova" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", country: "Georgia" },
  { code: "AMD", name: "Armenian Dram", symbol: "֏", country: "Armenia" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", country: "Azerbaijan" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", country: "Turkey" },
  
  // Middle Eastern currencies
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "United Arab Emirates" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", country: "Saudi Arabia" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", country: "Qatar" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", country: "Kuwait" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", country: "Bahrain" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", country: "Oman" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", country: "Jordan" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", country: "Lebanon" },
  { code: "SYP", name: "Syrian Pound", symbol: "£", country: "Syria" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", country: "Iraq" },
  { code: "IRR", name: "Iranian Rial", symbol: "﷼", country: "Iran" },
  { code: "AFN", name: "Afghan Afghani", symbol: "؋", country: "Afghanistan" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", country: "Israel" },
  
  // African currencies
  { code: "ZAR", name: "South African Rand", symbol: "R", country: "South Africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", country: "Egypt" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", country: "Nigeria" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", country: "Kenya" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", country: "Uganda" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", country: "Tanzania" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", country: "Ethiopia" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", country: "Ghana" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", country: "Morocco" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", country: "Tunisia" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", country: "Algeria" },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د", country: "Libya" },
  { code: "SDG", name: "Sudanese Pound", symbol: "ج.س.", country: "Sudan" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA", country: "West Africa" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", country: "Central Africa" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", country: "Mozambique" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", country: "Zambia" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", country: "Botswana" },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L", country: "Eswatini" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L", country: "Lesotho" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", country: "Malawi" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", country: "Mauritius" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨", country: "Seychelles" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", country: "Madagascar" },
  { code: "KMF", name: "Comorian Franc", symbol: "CF", country: "Comoros" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fdj", country: "Djibouti" },
  { code: "SOS", name: "Somali Shilling", symbol: "S", country: "Somalia" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", country: "Eritrea" },
  { code: "RWF", name: "Rwandan Franc", symbol: "R₣", country: "Rwanda" },
  { code: "BIF", name: "Burundian Franc", symbol: "FBu", country: "Burundi" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", country: "Angola" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "$", country: "Cape Verde" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D", country: "Gambia" },
  { code: "GNF", name: "Guinean Franc", symbol: "FG", country: "Guinea" },
  { code: "LRD", name: "Liberian Dollar", symbol: "L$", country: "Liberia" },
  { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le", country: "Sierra Leone" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db", country: "São Tomé and Príncipe" },
  
  // American currencies
  { code: "MXN", name: "Mexican Peso", symbol: "$", country: "Mexico" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", country: "Brazil" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", country: "Argentina" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", country: "Chile" },
  { code: "COP", name: "Colombian Peso", symbol: "$", country: "Colombia" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", country: "Peru" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$U", country: "Uruguay" },
  { code: "PYG", name: "Paraguayan Guarani", symbol: "Gs", country: "Paraguay" },
  { code: "BOB", name: "Bolivian Boliviano", symbol: "$b", country: "Bolivia" },
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs", country: "Venezuela" },
  { code: "GYD", name: "Guyanese Dollar", symbol: "$", country: "Guyana" },
  { code: "SRD", name: "Surinamese Dollar", symbol: "$", country: "Suriname" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", country: "Trinidad and Tobago" },
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$", country: "Jamaica" },
  { code: "BBD", name: "Barbadian Dollar", symbol: "Bds$", country: "Barbados" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "B$", country: "Bahamas" },
  { code: "BZD", name: "Belize Dollar", symbol: "BZ$", country: "Belize" },
  { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", country: "Guatemala" },
  { code: "HNL", name: "Honduran Lempira", symbol: "L", country: "Honduras" },
  { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", country: "Nicaragua" },
  { code: "CRC", name: "Costa Rican Colón", symbol: "₡", country: "Costa Rica" },
  { code: "PAB", name: "Panamanian Balboa", symbol: "B/.", country: "Panama" },
  { code: "DOP", name: "Dominican Peso", symbol: "RD$", country: "Dominican Republic" },
  { code: "HTG", name: "Haitian Gourde", symbol: "G", country: "Haiti" },
  { code: "CUP", name: "Cuban Peso", symbol: "₱", country: "Cuba" },
  { code: "XCD", name: "East Caribbean Dollar", symbol: "$", country: "Eastern Caribbean" },
  
  // Oceania currencies
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", country: "New Zealand" },
  { code: "FJD", name: "Fijian Dollar", symbol: "FJ$", country: "Fiji" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", country: "Papua New Guinea" },
  { code: "SBD", name: "Solomon Islands Dollar", symbol: "SI$", country: "Solomon Islands" },
  { code: "VUV", name: "Vanuatu Vatu", symbol: "VT", country: "Vanuatu" },
  { code: "WST", name: "Samoan Tala", symbol: "WS$", country: "Samoa" },
  { code: "TOP", name: "Tongan Paʻanga", symbol: "T$", country: "Tonga" },
  { code: "XPF", name: "CFP Franc", symbol: "₣", country: "French Pacific" },
  
  // Central Asian currencies
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", country: "Kazakhstan" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "лв", country: "Uzbekistan" },
  { code: "TJS", name: "Tajikistani Somoni", symbol: "SM", country: "Tajikistan" },
  { code: "KGS", name: "Kyrgyzstani Som", symbol: "лв", country: "Kyrgyzstan" },
  { code: "TMT", name: "Turkmenistani Manat", symbol: "T", country: "Turkmenistan" },
  { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", country: "Mongolia" },
  
  // Special currencies
  { code: "XAU", name: "Gold Ounce", symbol: "oz t", country: "Global" },
  { code: "XAG", name: "Silver Ounce", symbol: "oz t", country: "Global" },
  { code: "XPT", name: "Platinum Ounce", symbol: "oz t", country: "Global" },
  { code: "XPD", name: "Palladium Ounce", symbol: "oz t", country: "Global" },
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code);
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return `${amount} ${currencyCode}`;
  
  // Handle special formatting for different currencies
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  try {
    return formatter.format(amount);
  } catch {
    // Fallback for currencies not supported by Intl.NumberFormat
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
};

export const DEFAULT_CURRENCY = "USD";