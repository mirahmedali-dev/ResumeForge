document.addEventListener("DOMContentLoaded", () => {
  const template =
    localStorage.getItem("resumeTemplate") || "creative-minimalist";

  const cssLink = document.getElementById("preview-css");

  if (cssLink) {
    cssLink.href = `assets/css/preview-${template}.css`;
  }

  const resumeData = JSON.parse(
    localStorage.getItem("resumeData")
  );

  if (!resumeData) {
    document.getElementById("resumeContainer").innerHTML = `
      <div class="empty-state">
        <h2>No Resume Data Found</h2>
        <p>Please go back to the builder and create your resume.</p>
      </div>
    `;
    return;
  }

  const container = document.getElementById("resumeContainer");

  container.innerHTML = `
    <div class="resume">

      <!-- ================= HEADER ================= -->
      <header class="resume-header">

        <div class="header-main">
          <h1>${escapeHTML(resumeData.name || "Your Name")}</h1>

          <p class="resume-role">
            ${escapeHTML(resumeData.headline || "")}
          </p>
        </div>

        <div class="contact-info">

          ${
            resumeData.email
              ? `<a href="mailto:${escapeAttribute(resumeData.email)}">
                  ${escapeHTML(resumeData.email)}
                </a>`
              : ""
          }

          ${
            resumeData.phone
              ? `<span>${escapeHTML(resumeData.phone)}</span>`
              : ""
          }

          ${
            resumeData.address
              ? `<span>${escapeHTML(resumeData.address)}</span>`
              : ""
          }

          ${
            resumeData.linkedin
              ? `<a href="${safeURL(resumeData.linkedin)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    LinkedIn
                 </a>`
              : ""
          }

          ${
            resumeData.github
              ? `<a href="${safeURL(resumeData.github)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    GitHub
                 </a>`
              : ""
          }

          ${
            resumeData.portfolio
              ? `<a href="${safeURL(resumeData.portfolio)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    Portfolio
                 </a>`
              : ""
          }

        </div>

      </header>


      <!-- ================= MAIN ================= -->

      <main class="resume-content">

        ${
          resumeData.aboutMe || resumeData.summary
            ? `
              <section class="resume-section">
                <h2>Profile</h2>

                <p class="summary">
                  ${escapeHTML(
                    resumeData.aboutMe ||
                    resumeData.summary ||
                    ""
                  )}
                </p>
              </section>
            `
            : ""
        }


        ${generateSection(
          "Education",
          resumeData.educationEntries,
          edu => `
            <article class="resume-item">

              <div class="item-header">

                <div>
                  <h3>${escapeHTML(edu.degree || "")}</h3>

                  <p class="organization">
                    ${escapeHTML(edu.school || "")}
                  </p>
                </div>

                <span class="date">
                  ${escapeHTML(edu.year || "")}
                </span>

              </div>

              ${
                edu.grade
                  ? `<p class="grade">
                      ${escapeHTML(edu.grade)}
                     </p>`
                  : ""
              }

            </article>
          `
        )}


        ${generateSection(
          "Experience",
          resumeData.experienceEntries,
          exp => `
            <article class="resume-item">

              <div class="item-header">

                <div>
                  <h3>${escapeHTML(exp.jobTitle || "")}</h3>

                  <p class="organization">
                    ${escapeHTML(exp.company || "")}
                  </p>
                </div>

                <span class="date">
                  ${escapeHTML(exp.duration || "")}
                </span>

              </div>

              ${
                exp.responsibilities
                  ? `
                    <p>
                      ${formatText(
                        exp.responsibilities
                      )}
                    </p>
                  `
                  : ""
              }

            </article>
          `
        )}


        ${generateSection(
          "Projects",
          resumeData.projects,
          proj => `
            <article class="resume-item">

              <div class="item-header">

                <h3>
                  ${escapeHTML(
                    proj.projectTitle || ""
                  )}
                </h3>

                ${
                  proj.projectLink
                    ? `
                      <a
                        href="${safeURL(
                          proj.projectLink
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link"
                      >
                        View Project ↗
                      </a>
                    `
                    : ""
                }

              </div>

              ${
                proj.technologies
                  ? `
                    <p class="tech-stack">
                      ${escapeHTML(
                        proj.technologies
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                proj.projectDesc
                  ? `
                    <p>
                      ${formatText(
                        proj.projectDesc
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                proj.role
                  ? `
                    <p class="role">
                      <strong>Role:</strong>
                      ${escapeHTML(proj.role)}
                    </p>
                  `
                  : ""
              }

            </article>
          `
        )}


        ${generateSection(
          "Certifications",
          resumeData.certifications,
          cert => `
            <article class="resume-item">

              <div class="item-header">

                <div>
                  <h3>
                    ${escapeHTML(
                      cert.certName || ""
                    )}
                  </h3>

                  <p class="organization">
                    ${escapeHTML(
                      cert.issuedBy || ""
                    )}
                  </p>
                </div>

                <span class="date">
                  ${escapeHTML(
                    cert.certDate || ""
                  )}
                </span>

              </div>

              ${
                cert.certLink
                  ? `
                    <a
                      href="${safeURL(
                        cert.certLink
                      )}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate ↗
                    </a>
                  `
                  : ""
              }

            </article>
          `
        )}


        ${
          resumeData.achievements &&
          resumeData.achievements.length
            ? `
              <section class="resume-section">

                <h2>Achievements</h2>

                <ul class="achievement-list">

                  ${resumeData.achievements
                    .filter(Boolean)
                    .map(
                      achievement => `
                        <li>
                          ${escapeHTML(
                            achievement
                          )}
                        </li>
                      `
                    )
                    .join("")}

                </ul>

              </section>
            `
            : ""
        }


        ${
          resumeData.softSkills
            ? `
              <section class="resume-section">

                <h2>Skills</h2>

                <div class="skills-list">

                  ${resumeData.softSkills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean)
                    .map(
                      skill => `
                        <span class="skill">
                          ${escapeHTML(skill)}
                        </span>
                      `
                    )
                    .join("")}

                </div>

              </section>
            `
            : ""
        }


        ${generateSection(
          "Languages",
          resumeData.languages,
          language => `
            <div class="language-item">

              <strong>
                ${escapeHTML(
                  language.language || ""
                )}
              </strong>

              ${
                language.proficiency
                  ? `
                    <span>
                      ${escapeHTML(
                        language.proficiency
                      )}
                    </span>
                  `
                  : ""
              }

            </div>
          `
        )}

      </main>

    </div>
  `;


  // ================= PRINT =================

  const printBtn =
    document.getElementById("printBtn");

  if (printBtn) {
    printBtn.addEventListener(
      "click",
      () => window.print()
    );
  }
});


// =====================================================
// SECTION GENERATOR
// =====================================================

function generateSection(
  title,
  data,
  templateFn
) {
  if (!data || !data.length) {
    return "";
  }

  const validItems = data.filter(item => {
    return item && Object.values(item).some(value =>
      String(value || "").trim()
    );
  });

  if (!validItems.length) {
    return "";
  }

  return `
    <section class="resume-section">

      <h2>${title}</h2>

      ${validItems.map(templateFn).join("")}

    </section>
  `;
}


// =====================================================
// TEXT FORMATTER
// =====================================================

function formatText(text) {
  return escapeHTML(text)
    .replace(/\n/g, "<br>");
}


// =====================================================
// HTML ESCAPING
// =====================================================

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// =====================================================
// ATTRIBUTE ESCAPING
// =====================================================

function escapeAttribute(value) {
  return escapeHTML(value);
}


// =====================================================
// SAFE URL
// =====================================================
function safeURL(url) {
    if (!url) return "#";

    let value = String(url).trim();

    if (!value) return "#";

    if (!/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
        value = "https://" + value;
    }

    try {
        const parsed = new URL(value);

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:" ||
            parsed.protocol === "mailto:" ||
            parsed.protocol === "tel:"
        ) {
            return escapeAttribute(parsed.href);
        }

        return "#";

    } catch {
        return "#";
    }
}