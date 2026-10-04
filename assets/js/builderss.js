(function () {
  'use strict';

  /* =========================================================
     HELPERS
     ========================================================= */

  const qs = (selector, scope = document) =>
    scope.querySelector(selector);

  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const val = (selector, scope = document) => {
    const el = qs(selector, scope);
    return el ? (el.value || '').trim() : '';
  };

  /* =========================================================
     INITIALIZATION
     ========================================================= */

  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('resumeForm');

    /* -----------------------------------------
       Dynamic section buttons
       ----------------------------------------- */

    bindAdd(
      '#add-education',
      '#education-container',
      createEducationEntry
    );

    bindAdd(
      '#add-experience',
      '#experience-container',
      createExperienceEntry
    );

    bindAdd(
      '#add-project',
      '#projects-container',
      createProjectEntry
    );

    bindAdd(
      '#add-certification',
      '#certifications-container',
      createCertEntry
    );

    bindAdd(
      '#add-achievement',
      '#achievements-container',
      createAchievementEntry
    );

    bindAdd(
      '#add-language',
      '#languages-container',
      createLanguageEntry
    );

    bindAdd(
      '#add-reference',
      '#references-container',
      createReferenceEntry
    );

    bindAdd(
      '#add-custom-section',
      '#custom-sections-container',
      createCustomSectionEntry
    );

    /* -----------------------------------------
       Restore previously saved data
       ----------------------------------------- */

    loadFormData();

    /* -----------------------------------------
       Automatically save whenever user types
       ----------------------------------------- */

    if (form) {

      form.addEventListener('input', () => {
        saveFormData();
      });

      form.addEventListener('change', () => {
        saveFormData();
      });

      form.addEventListener('submit', generateResume);
    }

  });


  /* =========================================================
     DYNAMIC ADD BUTTON
     ========================================================= */

  function bindAdd(buttonSelector, containerSelector, factory) {

    const button = document.querySelector(buttonSelector);
    const container = document.querySelector(containerSelector);

    if (!button || !container) return;

    button.addEventListener('click', () => {

      const entry = factory();

      container.appendChild(entry);

      /* Save immediately after adding a section */
      saveFormData();

      /* Focus first field */
      const firstInput = entry.querySelector('input, textarea');

      if (firstInput) {
        firstInput.focus();
      }
    });
  }


  /* =========================================================
     GENERIC DIV CREATOR
     ========================================================= */

  function makeDiv(className, html) {

    const div = document.createElement('div');

    if (className) {
      div.className = className;
    }

    if (html) {
      div.innerHTML = html;
    }

    return div;
  }


  /* =========================================================
     EDUCATION
     ========================================================= */

  function createEducationEntry() {

    return makeDiv('education-entry', `
      <input
        type="text"
        class="degree"
        placeholder="Degree"
      >

      <input
        type="text"
        class="school"
        placeholder="Institution"
      >

      <input
        type="text"
        class="year"
        placeholder="Year"
      >

      <input
        type="text"
        class="grade"
        placeholder="Grade / Percentage"
      >
    `);
  }


  /* =========================================================
     EXPERIENCE
     ========================================================= */

  function createExperienceEntry() {

    return makeDiv('experience-entry', `
      <input
        type="text"
        class="job-title"
        placeholder="Job Title"
      >

      <input
        type="text"
        class="company"
        placeholder="Company"
      >

      <input
        type="text"
        class="duration"
        placeholder="Duration"
      >

      <textarea
        class="responsibilities"
        placeholder="Responsibilities"
      ></textarea>
    `);
  }


  /* =========================================================
     PROJECTS
     ========================================================= */

  function createProjectEntry() {

    return makeDiv('project-entry', `
      <input
        type="text"
        class="project-title"
        placeholder="Project Title"
      >

      <input
        type="text"
        class="technologies"
        placeholder="Technologies Used"
      >

      <textarea
        class="project-description"
        placeholder="Project Description"
      ></textarea>

      <input
        type="text"
        class="role"
        placeholder="Role / Contributions"
      >

      <input
        type="url"
        class="project-link"
        placeholder="Project Link (optional)"
      >
    `);
  }


  /* =========================================================
     CERTIFICATIONS
     ========================================================= */

  function createCertEntry() {

    return makeDiv('cert-entry', `
      <input
        type="text"
        class="cert-name"
        placeholder="Certificate Name"
      >

      <input
        type="text"
        class="cert-issued-by"
        placeholder="Issued By"
      >

      <input
        type="text"
        class="cert-date"
        placeholder="Date"
      >

      <input
        type="url"
        class="cert-link"
        placeholder="Certificate Link (optional)"
      >
    `);
  }


  /* =========================================================
     ACHIEVEMENTS
     ========================================================= */

  function createAchievementEntry() {

    const input = document.createElement('input');

    input.type = 'text';

    input.className = 'achievement';

    input.placeholder = 'Achievement';

    return input;
  }


  /* =========================================================
     LANGUAGES
     ========================================================= */

  function createLanguageEntry() {

    return makeDiv('language-entry', `
      <input
        type="text"
        class="language"
        placeholder="Language"
      >

      <input
        type="text"
        class="language-proficiency"
        placeholder="Proficiency"
      >
    `);
  }


  /* =========================================================
     REFERENCES
     ========================================================= */

  function createReferenceEntry() {

    return makeDiv('reference-entry', `
      <input
        type="text"
        class="ref-name"
        placeholder="Name"
      >

      <input
        type="text"
        class="ref-designation"
        placeholder="Designation"
      >

      <input
        type="text"
        class="ref-organization"
        placeholder="Organization"
      >

      <input
        type="email"
        class="ref-email"
        placeholder="Contact Email"
      >

      <input
        type="tel"
        class="ref-phone"
        placeholder="Contact Phone"
      >
    `);
  }


  /* =========================================================
     CUSTOM SECTIONS
     ========================================================= */

  function createCustomSectionEntry() {

    return makeDiv('custom-section-entry', `
      <input
        type="text"
        class="custom-heading"
        placeholder="Section Heading"
      >

      <textarea
        class="custom-content"
        placeholder="Write content here..."
      ></textarea>
    `);
  }


  /* =========================================================
     COLLECT FORM DATA
     ========================================================= */

  function collectFormData() {

    const educationEntries = qsa('.education-entry')
      .map(entry => ({
        degree: val('.degree', entry),
        school: val('.school', entry),
        year: val('.year', entry),
        grade: val('.grade', entry)
      }))
      .filter(item =>
        item.degree ||
        item.school ||
        item.year ||
        item.grade
      );


    const experienceEntries = qsa('.experience-entry')
      .map(entry => ({
        jobTitle: val('.job-title', entry),
        company: val('.company', entry),
        duration: val('.duration', entry),
        responsibilities: val(
          '.responsibilities',
          entry
        )
      }))
      .filter(item =>
        item.jobTitle ||
        item.company ||
        item.duration ||
        item.responsibilities
      );


    const projects = qsa('.project-entry')
      .map(entry => ({
        projectTitle: val(
          '.project-title',
          entry
        ),

        technologies: val(
          '.technologies',
          entry
        ),

        projectDesc: val(
          '.project-description',
          entry
        ),

        role: val(
          '.role',
          entry
        ),

        projectLink: val(
          '.project-link',
          entry
        )
      }))
      .filter(item =>
        item.projectTitle ||
        item.technologies ||
        item.projectDesc ||
        item.role ||
        item.projectLink
      );


    const certifications = qsa('.cert-entry')
      .map(entry => ({
        certName: val(
          '.cert-name',
          entry
        ),

        issuedBy: val(
          '.cert-issued-by',
          entry
        ),

        certDate: val(
          '.cert-date',
          entry
        ),

        certLink: val(
          '.cert-link',
          entry
        )
      }))
      .filter(item =>
        item.certName ||
        item.issuedBy ||
        item.certDate ||
        item.certLink
      );


    const achievements = qsa('.achievement')
      .map(input =>
        (input.value || '').trim()
      )
      .filter(Boolean);


    const languages = qsa('.language-entry')
      .map(entry => ({
        language: val(
          '.language',
          entry
        ),

        proficiency: val(
          '.language-proficiency',
          entry
        )
      }))
      .filter(item =>
        item.language ||
        item.proficiency
      );


    const references = qsa('.reference-entry')
      .map(entry => ({
        refName: val(
          '.ref-name',
          entry
        ),

        refDesignation: val(
          '.ref-designation',
          entry
        ),

        refOrganization: val(
          '.ref-organization',
          entry
        ),

        refEmail: val(
          '.ref-email',
          entry
        ),

        refPhone: val(
          '.ref-phone',
          entry
        )
      }))
      .filter(item =>
        item.refName ||
        item.refDesignation ||
        item.refOrganization ||
        item.refEmail ||
        item.refPhone
      );


    const customSections = qsa(
      '.custom-section-entry'
    )
      .map(entry => ({
        heading: val(
          '.custom-heading',
          entry
        ),

        content: val(
          '.custom-content',
          entry
        )
      }))
      .filter(item =>
        item.heading ||
        item.content
      );


    return {

      /* -----------------------------------------
         Basic Information
         ----------------------------------------- */

      name: val('.contact-name'),

      email: val('.contact-email'),

      phone: val('.contact-phone'),

      address: val('.contact-address'),

      linkedin: val('.contact-linkedin'),

      github: val('.contact-github'),

      portfolio: val('.contact-portfolio'),


      /* -----------------------------------------
         Profile
         ----------------------------------------- */

      aboutMe: val('#summary'),


      /* -----------------------------------------
         Technical Skills
         ----------------------------------------- */

      technicalSkills: {

        programming: val(
          '.programming-skills'
        ),

        web: val(
          '.web-skills'
        ),

        database: val(
          '.database-skills'
        ),

        core: val(
          '.core-skills'
        ),

        tools: val(
          '.tools-skills'
        )
      },


      /* -----------------------------------------
         Resume Sections
         ----------------------------------------- */

      educationEntries,

      experienceEntries,

      projects,

      certifications,

      achievements,

      languages,

      references,

      customSections

    };
  }


  /* =========================================================
     SAVE FORM DATA
     ========================================================= */

  function saveFormData() {

    try {

      const data = collectFormData();

      localStorage.setItem(
        'resumeData',
        JSON.stringify(data)
      );

      console.log('Resume auto-saved.');

    } catch (error) {

      console.error(
        'Unable to auto-save resume:',
        error
      );
    }
  }


  /* =========================================================
     LOAD SAVED DATA
     ========================================================= */

  function loadFormData() {

    try {

      const savedData =
        localStorage.getItem('resumeData');

      if (!savedData) {
        return;
      }

      const data = JSON.parse(savedData);

      /* -----------------------------------------
         Basic information
         ----------------------------------------- */

      setValue(
        '.contact-name',
        data.name
      );

      setValue(
        '.contact-email',
        data.email
      );

      setValue(
        '.contact-phone',
        data.phone
      );

      setValue(
        '.contact-address',
        data.address
      );

      setValue(
        '.contact-linkedin',
        data.linkedin
      );

      setValue(
        '.contact-github',
        data.github
      );

      setValue(
        '.contact-portfolio',
        data.portfolio
      );


      /* -----------------------------------------
         Profile
         ----------------------------------------- */

      setValue(
        '#summary',
        data.aboutMe
      );


      /* -----------------------------------------
         Technical Skills
         ----------------------------------------- */

      const skills =
        data.technicalSkills || {};

      setValue(
        '.programming-skills',
        skills.programming
      );

      setValue(
        '.web-skills',
        skills.web
      );

      setValue(
        '.database-skills',
        skills.database
      );

      setValue(
        '.core-skills',
        skills.core
      );

      setValue(
        '.tools-skills',
        skills.tools
      );


      /* -----------------------------------------
         Dynamic sections
         ----------------------------------------- */

      restoreEducation(
        data.educationEntries
      );

      restoreExperience(
        data.experienceEntries
      );

      restoreProjects(
        data.projects
      );

      restoreCertifications(
        data.certifications
      );

      restoreAchievements(
        data.achievements
      );

      restoreLanguages(
        data.languages
      );

      restoreReferences(
        data.references
      );

      restoreCustomSections(
        data.customSections
      );


      console.log(
        'Saved resume data restored.'
      );

    } catch (error) {

      console.error(
        'Unable to load saved resume:',
        error
      );
    }
  }


  /* =========================================================
     SET INPUT VALUE
     ========================================================= */

  function setValue(selector, value, scope = document) {

    const element = scope.querySelector(selector);

    if (
        element &&
        value !== undefined &&
        value !== null
    ) {
        element.value = value;
    }
}


  /* =========================================================
     RESTORE EDUCATION
     ========================================================= */

  function restoreEducation(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'education-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createEducationEntry();

      container.appendChild(entry);

      setValue(
        '.degree',
        item.degree,
        entry
      );

      setValue(
        '.school',
        item.school,
        entry
      );

      setValue(
        '.year',
        item.year,
        entry
      );

      setValue(
        '.grade',
        item.grade,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE EXPERIENCE
     ========================================================= */

  function restoreExperience(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'experience-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createExperienceEntry();

      container.appendChild(entry);

      setValue(
        '.job-title',
        item.jobTitle,
        entry
      );

      setValue(
        '.company',
        item.company,
        entry
      );

      setValue(
        '.duration',
        item.duration,
        entry
      );

      setValue(
        '.responsibilities',
        item.responsibilities,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE PROJECTS
     ========================================================= */

  function restoreProjects(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'projects-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createProjectEntry();

      container.appendChild(entry);

      setValue(
        '.project-title',
        item.projectTitle,
        entry
      );

      setValue(
        '.technologies',
        item.technologies,
        entry
      );

      setValue(
        '.project-description',
        item.projectDesc,
        entry
      );

      setValue(
        '.role',
        item.role,
        entry
      );

      setValue(
        '.project-link',
        item.projectLink,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE CERTIFICATIONS
     ========================================================= */

  function restoreCertifications(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'certifications-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createCertEntry();

      container.appendChild(entry);

      setValue(
        '.cert-name',
        item.certName,
        entry
      );

      setValue(
        '.cert-issued-by',
        item.issuedBy,
        entry
      );

      setValue(
        '.cert-date',
        item.certDate,
        entry
      );

      setValue(
        '.cert-link',
        item.certLink,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE ACHIEVEMENTS
     ========================================================= */

  function restoreAchievements(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'achievements-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(text => {

      const input =
        createAchievementEntry();

      input.value = text;

      container.appendChild(input);
    });
  }


  /* =========================================================
     RESTORE LANGUAGES
     ========================================================= */

  function restoreLanguages(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'languages-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createLanguageEntry();

      container.appendChild(entry);

      setValue(
        '.language',
        item.language,
        entry
      );

      setValue(
        '.language-proficiency',
        item.proficiency,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE REFERENCES
     ========================================================= */

  function restoreReferences(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'references-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createReferenceEntry();

      container.appendChild(entry);

      setValue(
        '.ref-name',
        item.refName,
        entry
      );

      setValue(
        '.ref-designation',
        item.refDesignation,
        entry
      );

      setValue(
        '.ref-organization',
        item.refOrganization,
        entry
      );

      setValue(
        '.ref-email',
        item.refEmail,
        entry
      );

      setValue(
        '.ref-phone',
        item.refPhone,
        entry
      );
    });
  }


  /* =========================================================
     RESTORE CUSTOM SECTIONS
     ========================================================= */

  function restoreCustomSections(entries) {

    if (!Array.isArray(entries)) return;

    const container =
      document.getElementById(
        'custom-sections-container'
      );

    if (!container) return;

    container.innerHTML = '';

    entries.forEach(item => {

      const entry =
        createCustomSectionEntry();

      container.appendChild(entry);

      setValue(
        '.custom-heading',
        item.heading,
        entry
      );

      setValue(
        '.custom-content',
        item.content,
        entry
      );
    });
  }


  /* =========================================================
     GENERATE RESUME
     ========================================================= */

  function generateResume(event) {

    if (
      event &&
      typeof event.preventDefault === 'function'
    ) {
      event.preventDefault();
    }

    /*
     * Save one final time before opening preview.
     */
    saveFormData();

    /*
     * Make sure the selected template is saved.
     */
    const params =
      new URLSearchParams(
        window.location.search
      );

    const template =
      params.get('template') ||
      localStorage.getItem(
        'resumeTemplate'
      ) ||
      'creative-minimalist';

    localStorage.setItem(
      'resumeTemplate',
      template
    );

    /*
     * Open preview.
     */
    window.location.href =
      'preview.html';
  }


  /* =========================================================
     GLOBAL FUNCTION
     ========================================================= */

  window.generateResume =
    generateResume;

})();