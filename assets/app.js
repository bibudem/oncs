var fileTypes = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.tiff': 'image',
  '.tif': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.mp4': 'video',
  '.mpg': 'video',
  '.mpeg': 'video',
  '.mkv': 'video',
  '.avi': 'video',
  '.ogg': 'video',
  '.mp3': 'audio'
}

var dots = '<span class="options"><svg style="width:24px;height:24px" viewBox="0 0 24 24" class="options-icon"><path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" /></svg></span>'

function isDir(el) {
  return $(el).find('> *:first').text().endsWith('/')
}

function isMedia(el) {
  var ext = $(el).find('> *:first').text().replace(/(.+)(\..+)$/, '$2')
  return typeof fileTypes[ext] !== 'undefined'
}

function getURLFromMediaPath(path) {
  var url = new URL(location.href)
  url.search = ''
  url.hash = ''
  url.pathname = path;
  return url.href;
}

function openOptions(el) {
  if ($('.options-container').length === 1) {
    return
  }

  $(el).append('<ul class="options-container shadow"></ul>')

  var $optionsContainer = $(el).find('.options-container')
  var mediaPath = $(el).parent().find('> *:first').text();
  var mediaContext = $('.navbar .active').attr('href');
  if (mediaContext !== '/') {
    mediaContext += '/'
  }
  var generateurParam = encodeURIComponent(getURLFromMediaPath('/generateur' + mediaContext + mediaPath))

  $optionsContainer.append('<li><a href="/mirador/?manifest=' + generateurParam + '" target="_blank">Ouvrir dans Mirador</a></li>');
  $optionsContainer.append('<li><a href="/universalviewer/?manifest=' + generateurParam + '" target="_blank">Ouvrir dans Universal Viewer</a></li>');
  $optionsContainer.append('<li><a href="/generateur/' + mediaContext + mediaPath + '" target="_blank">Afficher le manifest</a></li>');
  $optionsContainer.append('<li><a href="http://localhost:8182/iiif/3' + mediaContext + mediaPath + '/full/max/0/default.jpg" target="_blank">Image via serveur IIIF</a></li>');
  $optionsContainer.append('<li><a href="http://localhost:8182/iiif/3' + mediaContext + mediaPath + '/info.json" target="_blank">info.json</a></li>');

  $(document).on('mouseup', documentOnMouseup);
}

function closeOptions($el) {
  $el.remove();
  $(document).off('mouseup')
}

// Toggle show/hide typeahead on click outside
function documentOnMouseup(e) {
  var $container = $('.options-container');
  // if the target of the click isn't the container nor a descendant of the container
  if (!$container.is(e.target) && $container.has(e.target).length === 0) {
    closeOptions($container)
  }
}

$(function () {
  $('.file-or-dir').each(function (i, fileOrDir) {
    if (!isDir(fileOrDir)) {
      if (isMedia(fileOrDir)) {
        $(this).append(dots)
      }
    }
  })

  $('.options').on('click', function (e) {
    if ($('.options-container').length === 0) {
      openOptions(this)
    }
  })


})