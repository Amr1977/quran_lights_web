var AVATAR_DIR = "avatars";
var DEFAULT_AVATAR_COLORS = ["#667eea", "#764ba2", "#e94560", "#0f3460", "#16a34a", "#ca8a04"];

var profileUser = null;
var profileAuthUser = null;
var profileAvatarFile = null;
var avatarUploadTask = null;
var profileAuthListener = null;

function initProfile() {
  profileAuthUser = firebase.auth().currentUser;

  if (profileAuthUser) {
    profileUser = profileAuthUser;
    renderProfile(profileAuthUser);
    enableProfileEditing(true);
    return;
  }

  // If not resolved, listen for auth state
  profileAuthListener = firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      profileAuthUser = user;
      profileUser = user;
      renderProfile(user);
      enableProfileEditing(true);
    }
  });

  // Show cached data immediately (read-only)
  var cachedUser = JSON.parse(localStorage.getItem("user"));
  if (cachedUser && cachedUser.uid) {
    profileUser = cachedUser;
    renderProfile(cachedUser);
    enableProfileEditing(false);
  }
}

function enableProfileEditing(enabled) {
  var inputs = document.querySelectorAll("#profile_tab .profile-input, #profile_tab .ie-btn, #profile_tab .profile-save-btn");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = !enabled;
  }
}

function renderProfile(user) {
  displayAvatar(user);
  displayEmail(user);
  displayMemberSince(user);
  displayName(user);
  setupAvatarUpload(user);
  setupNameSave(user);
}

function displayAvatar(user) {
  var img = document.getElementById("profile-avatar-img");
  var initials = document.getElementById("profile-avatar-initials");
  var removeBtn = document.getElementById("profile-remove-btn");

  if (user.photoURL) {
    img.src = user.photoURL;
    img.style.display = "block";
    initials.style.display = "none";
    if (removeBtn) removeBtn.style.display = "inline-flex";
  } else {
    img.style.display = "none";
    initials.textContent = getInitials(user);
    initials.style.backgroundColor = getAvatarColor(user.uid);
    initials.style.display = "flex";
    if (removeBtn) removeBtn.style.display = "none";
  }
}

function getInitials(user) {
  if (user.displayName) {
    return user.displayName.charAt(0).toUpperCase();
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return "?";
}

function getAvatarColor(uid) {
  if (!uid) return DEFAULT_AVATAR_COLORS[0];
  var hash = 0;
  for (var i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }
  var index = Math.abs(hash) % DEFAULT_AVATAR_COLORS.length;
  return DEFAULT_AVATAR_COLORS[index];
}

function displayEmail(user) {
  var emailEl = document.getElementById("profile-email");
  var badgeEl = document.getElementById("profile-email-badge");

  if (emailEl) emailEl.textContent = user.email || "";

  if (badgeEl) {
    if (user.emailVerified) {
      badgeEl.textContent = window.i18n ? window.i18n.getTranslation("profile.emailVerified") : "Verified";
      badgeEl.className = "profile-badge profile-badge-verified";
    } else {
      badgeEl.textContent = window.i18n ? window.i18n.getTranslation("profile.emailNotVerified") : "Not Verified";
      badgeEl.className = "profile-badge profile-badge-unverified";
    }
  }
}

function displayMemberSince(user) {
  var el = document.getElementById("profile-member-since");
  if (!el) return;
  if (user.metadata && user.metadata.creationTime) {
    var d = new Date(user.metadata.creationTime);
    el.textContent = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } else {
    el.textContent = "-";
  }
}

function displayName(user) {
  var input = document.getElementById("profile-display-name");
  if (input) {
    input.value = user.displayName || "";
  }
}

function setupAvatarUpload() {
  var uploadBtn = document.getElementById("profile-upload-btn");
  var fileInput = document.getElementById("profile-avatar-input");

  if (!uploadBtn || !fileInput) return;

  uploadBtn.onclick = function () {
    fileInput.click();
  };

  fileInput.onchange = function () {
    var file = fileInput.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      showToast("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB");
      return;
    }

    profileAvatarFile = file;
    uploadAvatar();
  };

  var removeBtn = document.getElementById("profile-remove-btn");
  if (removeBtn) {
    removeBtn.onclick = function () {
      removeAvatar();
    };
  }
}

function uploadAvatar() {
  var user = profileAuthUser;
  if (!user) return;
  var uploadBtn = document.getElementById("profile-upload-btn");
  var originalText = uploadBtn ? uploadBtn.innerHTML : "";

  if (uploadBtn) {
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = '<span>⏳</span><span>' +
      (window.i18n ? window.i18n.getTranslation("profile.saving") : "Saving...") +
      '</span>';
  }

  try {
    var storageRef = firebase.storage().ref();
    var avatarRef = storageRef.child(AVATAR_DIR + "/" + user.uid + "/avatar.jpg");

    avatarUploadTask = avatarRef.put(profileAvatarFile, {
      contentType: "image/jpeg",
      cacheControl: "public,max-age=31536000"
    });

    avatarUploadTask.then(function (snapshot) {
      return snapshot.ref.getDownloadURL();
    }).then(function (downloadURL) {
      return user.updateProfile({ photoURL: downloadURL });
    }).then(function () {
      var cachedUser = JSON.parse(localStorage.getItem("user"));
      if (cachedUser) {
        cachedUser.photoURL = user.photoURL;
        localStorage.setItem("user", JSON.stringify(cachedUser));
      }
      displayAvatar(user);
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalText;
      }
      showToast(window.i18n ? window.i18n.getTranslation("profile.avatarUpdated") : "Profile picture updated");
    }).catch(function (error) {
      console.error("Avatar upload error:", error);
      if (uploadBtn) {
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalText;
      }
      showToast(window.i18n ? window.i18n.getTranslation("profile.uploadError") : "Failed to upload image");
    });
  } catch (e) {
    console.error("Storage error:", e);
    if (uploadBtn) {
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = originalText;
    }
    showToast("Storage not available. Check your connection.");
  }
}

function removeAvatar() {
  var user = profileAuthUser;
  if (!user) return;
  var removeBtn = document.getElementById("profile-remove-btn");
  removeBtn.disabled = true;

  try {
    var storageRef = firebase.storage().ref();
    var avatarRef = storageRef.child(AVATAR_DIR + "/" + user.uid + "/avatar.jpg");

    avatarRef.delete().then(function () {
      return user.updateProfile({ photoURL: null });
    }).then(function () {
      var cachedUser = JSON.parse(localStorage.getItem("user"));
      if (cachedUser) {
        cachedUser.photoURL = null;
        localStorage.setItem("user", JSON.stringify(cachedUser));
      }
      displayAvatar(user);
      removeBtn.disabled = false;
      showToast(window.i18n ? window.i18n.getTranslation("profile.avatarRemoved") : "Profile picture removed");
    }).catch(function (error) {
      console.error("Avatar remove error:", error);
      if (error.code === "storage/object-not-found") {
        user.updateProfile({ photoURL: null }).then(function () {
          var cachedUser = JSON.parse(localStorage.getItem("user"));
          if (cachedUser) {
            cachedUser.photoURL = null;
            localStorage.setItem("user", JSON.stringify(cachedUser));
          }
          displayAvatar(user);
          removeBtn.disabled = false;
        });
      } else {
        removeBtn.disabled = false;
        showToast(window.i18n ? window.i18n.getTranslation("profile.removeError") : "Failed to remove image");
      }
    });
  } catch (e) {
    console.error("Storage error:", e);
    removeBtn.disabled = false;
    showToast("Storage not available. Check your connection.");
  }
}

function setupNameSave() {
  var saveBtn = document.getElementById("profile-save-btn");
  var nameInput = document.getElementById("profile-display-name");
  if (!saveBtn || !nameInput) return;

  saveBtn.onclick = function () {
    var authUser = profileAuthUser;
    if (!authUser) return;

    var newName = nameInput.value.trim();
    if (!newName) {
      showToast("Please enter a display name");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span>⏳</span><span>' +
      (window.i18n ? window.i18n.getTranslation("profile.saving") : "Saving...") +
      '</span>';

    authUser.updateProfile({ displayName: newName }).then(function () {
      var cachedUser = JSON.parse(localStorage.getItem("user"));
      if (cachedUser) {
        cachedUser.displayName = newName;
        localStorage.setItem("user", JSON.stringify(cachedUser));
      }
      profileUser = authUser;
      displayAvatar(profileUser);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>💾</span><span>' +
        (window.i18n ? window.i18n.getTranslation("profile.save") : "Save Changes") +
        '</span>';
      showToast(window.i18n ? window.i18n.getTranslation("profile.nameUpdated") : "Display name updated");
    }).catch(function (error) {
      console.error("Name update error:", error);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<span>💾</span><span>' +
        (window.i18n ? window.i18n.getTranslation("profile.save") : "Save Changes") +
        '</span>';
      showToast(window.i18n ? window.i18n.getTranslation("profile.nameError") : "Failed to update name");
    });
  };
}

function profileCleanup() {
  if (profileAuthListener) {
    profileAuthListener();
    profileAuthListener = null;
  }
  profileUser = null;
  profileAvatarFile = null;
  avatarUploadTask = null;
}

if (typeof window.initProfile === "undefined") {
  window.initProfile = initProfile;
}

if (typeof window.profileCleanup === "undefined") {
  window.profileCleanup = profileCleanup;
}
