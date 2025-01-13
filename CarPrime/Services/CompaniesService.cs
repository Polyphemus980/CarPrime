using CarPrime.Companies;

namespace CarPrime.Services;

public sealed class CompaniesService
{
    private readonly IReadOnlyDictionary<int, ICarCompany> _companies;

    public CompaniesService()
    {
        _companies = new Dictionary<int, ICarCompany>([
            
            //TODO kolejne implementacje ICarCompany
        ]);
    }

    public IEnumerable<ICarCompany> AllCompanies => _companies.Values;


    public ICarCompany this[int companyId] => _companies[companyId];
}