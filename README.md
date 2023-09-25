# Property Picker (Zoopla & Rightmove)

[Install this extension](https://chrome.google.com/webstore/detail/property-picker-zoopla-ri/alhgnjcbifgcolhemhfpglfefdpkgffo?hl=en-GB)

Have you ever browsed Zoopla or Rightmove during the current UK housing market increase and no longer have a feasible idea of what you can afford, or perhaps how far away you are from affording a particular property? 

Whether that's a rental property, your first home, or your next move - this extension takes away all of the guess work you have when scrolling through listings. 

When you enable Property Picker and fill in some basic details, listings will be colour coded into 4 segments: 
- Green (affordable)
- Yellow (within reach)
- Orange (possible but restrictive)
- Red (out of reach)

For every property you browse, there's a swift calculation on your tailored affordability rating. 

This is based on your annual salary and monthly salary after tax. If you are looking to buy a property you can also enter your deposit amount, as well as the mortgage interest rate you are looking to achieve. Feel free to play around with these amounts to see how any fluctuation will effect your rating.

You can also filter your properties based on your input. For example, you may only want to see properties in the "affordable" or "within reach" categories. Just select the option at the top of the listings to see your filtered results.

If you are looking at for sale properties, you will also see an estimated monthly payment. For rentals, you'll get an additional yearly income amount you may need to live comfortably.

_____

Please note: this extension is for properties based in the UK only for zoopla.co.uk and rightmove.co.uk.

## Running this locally (Google Chrome)

1. Fork this repository and clone to your local setup
2. Run `npm install` and then `npm run start` to watch for changes
3. In `manifest.json`, remove the `"browser_specific_settings"` object (this is for use on Firefox only)
4. In a Chrome browser go to `chrome://extensions/` > "load unpacked"
5. Select the directory where you have cloned this repository
6. You should now be able to run this extension locally 🎉

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Credits

- [Josh Embling](https://github.com/joshembling)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
