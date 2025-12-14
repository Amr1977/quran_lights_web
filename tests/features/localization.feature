Feature: Language Localization
  As a user visiting the Quran Lights website
  I want to switch between different languages
  So that I can read the content in my preferred language

  Background:
    Given I am on the landing page

  Scenario: Language switcher is visible
    Then I should see the language switcher with globe icon
    And the current language should be "العربية"

  Scenario Outline: Switch to different languages
    When I click on the language switcher
    And I select "<language>" from the dropdown
    Then the page content should be in "<language>"
    And the page title should be "<expected_title>"
    And the language should persist after page reload

    Examples:
      | language   | expected_title                                    |
      | English    | Quran Lights - Read, Rise, and Recite           |
      | Español    | Luces del Corán - Lee, Elévate y Recita         |
      | Français   | Lumières du Coran - Lis, Élève-toi et Récite    |
      | Deutsch    | Quran Lichter - Lies, Erhebe dich und Rezitiere |
      | 中文        | 古兰经之光 - 诵读、提升与吟诵                              |
      | हिन्दी      | कुरान लाइट्स - पढ़ें, उठें और पाठ करें                 |
      | Português  | Luzes do Alcorão - Leia, Eleve-se e Recite      |
      | اردو       | قرآن لائٹس - پڑھیں، بلند ہوں اور تلاوت کریں            |
      | 日本語       | コーランライト - 読み、高め、朗読する                          |

  Scenario: RTL languages switch page direction
    When I click on the language switcher
    And I select "اردو" from the dropdown
    Then the page direction should be "rtl"
    When I select "English" from the dropdown
    Then the page direction should be "ltr"

  Scenario: Navigation items are translated
    When I click on the language switcher
    And I select "English" from the dropdown
    Then the navigation item "الدخول" should be "Sign In"
    And the navigation item "إنشاء حساب" should be "Sign Up"
    And the navigation item "دعم الموقع" should be "Support"

  Scenario: Content sections are translated
    When I click on the language switcher
    And I select "English" from the dropdown
    Then the home section title should contain "Charts and Dashboards"
    And the feature section should contain "Each Surah is Represented"
    And the contact section should contain "Contact Us"

  Scenario: Meta tags are updated
    When I click on the language switcher
    And I select "English" from the dropdown
    Then the meta description should contain "Track your Quran recitation"
    And the HTML lang attribute should be "en"
