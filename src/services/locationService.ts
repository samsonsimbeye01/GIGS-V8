interface LocationData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  currency: string;
  timezone: string;
}

class LocationService {
  private cachedLocation: LocationData | null = null;

  async detectLocation(): Promise<LocationData> {
    if (this.cachedLocation) {
      return this.cachedLocation;
    }

    try {
      // Try IP-based geolocation first
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_name) {
        this.cachedLocation = {
          country: data.country_name,
          countryCode: data.country_code,
          city: data.city,
          region: data.region,
          latitude: data.latitude,
          longitude: data.longitude,
          currency: this.getCurrencyForCountry(data.country_code),
          timezone: data.timezone
        };
        return this.cachedLocation;
      }
    } catch (error) {
      console.warn('IP geolocation failed:', error);
    }

    // Fallback to browser geolocation
    try {
      const position = await this.getBrowserLocation();
      const locationData = await this.reverseGeocode(position.coords.latitude, position.coords.longitude);
      return locationData;
    } catch (error) {
      console.warn('Browser geolocation failed:', error);
    }

    // Final fallback - default to Nigeria
    return {
      country: 'Nigeria',
      countryCode: 'NG',
      city: 'Lagos',
      region: 'Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      currency: 'NGN',
      timezone: 'Africa/Lagos'
    };
  }

  private getBrowserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }

  private async reverseGeocode(lat: number, lng: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      
      return {
        country: data.countryName || 'Nigeria',
        countryCode: data.countryCode || 'NG',
        city: data.city || data.locality || 'Lagos',
        region: data.principalSubdivision || 'Lagos',
        latitude: lat,
        longitude: lng,
        currency: this.getCurrencyForCountry(data.countryCode || 'NG'),
        timezone: 'Africa/Lagos' // Default timezone
      };
    } catch (error) {
      throw new Error('Reverse geocoding failed');
    }
  }

  private getCurrencyForCountry(countryCode: string): string {
    const currencyMap: { [key: string]: string } = {
      'NG': 'NGN', 'KE': 'KES', 'GH': 'GHS', 'UG': 'UGX',
      'TZ': 'TZS', 'ZA': 'ZAR', 'EG': 'EGP', 'MA': 'MAD',
      'ET': 'ETB', 'DZ': 'DZD', 'AO': 'AOA', 'SD': 'SDG',
      'MZ': 'MZN', 'MG': 'MGA', 'CM': 'XAF', 'CI': 'XOF',
      'NE': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'SN': 'XOF',
      'TD': 'XAF', 'GN': 'GNF', 'RW': 'RWF', 'BI': 'BIF',
      'TN': 'TND', 'SO': 'SOS', 'LR': 'LRD', 'SL': 'SLL',
      'TG': 'XOF', 'ER': 'ERN', 'GM': 'GMD', 'LS': 'LSL',
      'GW': 'XOF', 'MR': 'MRU', 'SZ': 'SZL', 'DJ': 'DJF',
      'CF': 'XAF', 'GQ': 'XAF', 'KM': 'KMF', 'CV': 'CVE',
      'ST': 'STN', 'SC': 'SCR', 'MU': 'MUR'
    };
    return currencyMap[countryCode] || 'USD';
  }

  getPaymentMethods(countryCode: string): string[] {
    const paymentMap: { [key: string]: string[] } = {
      'KE': ['M-Pesa', 'Airtel Money', 'Card', 'Bank Transfer'],
      'NG': ['Paystack', 'Flutterwave', 'Bank Transfer', 'USSD'],
      'GH': ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money', 'Card'],
      'UG': ['MTN Mobile Money', 'Airtel Money', 'Card'],
      'TZ': ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa'],
      'ZA': ['Card', 'EFT', 'SnapScan', 'Zapper']
    };
    return paymentMap[countryCode] || ['Card', 'Bank Transfer'];
  }
}

export const locationService = new LocationService();
export type { LocationData };