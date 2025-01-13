using CarPrime.Companies;

namespace CarPrime.Services;

public sealed class CompaniesService
{
    private readonly IReadOnlyDictionary<int, ICarCompany> _companies;

    public CompaniesService(CarPrimeService carPrimeService)
    {
        _companies = new Dictionary<int, ICarCompany>([
            new KeyValuePair<int, ICarCompany>(0, new CarPrimeCompany(carPrimeService)),
            // kolejne implementacje ICarCompany...
        ]);
    }

    public IEnumerable<ICarCompany> AllCompanies => _companies.Values;


    public ICarCompany this[int companyId] => _companies[companyId];
}