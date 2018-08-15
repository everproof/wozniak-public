module Jekyll
  class VideoSectionBlock < Liquid::Block
    def initialize(tag_name, args, tokens)
      dirs = ["left", "right"]
      @args = Helpers.parse_args(args)

      if @args.length != 3
        raise "Invalid number of arguments. Expected 3 got #{@args.length}."
      end

      @dir = @args[0]
      @video_id = @args[1]
      @title = @args[2]

      if !dirs.include?(@dir) then
        raise "Must provide a valid direction (left or right)."
      end
      super
    end

    def render(context)
      site = context.registers[:site]
      contents = super
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      # pipe param through liquid to make additional replacements possible
      # content = Liquid::Template.parse(contents).render context
      content = converter.convert(contents)

<<EOS
<section class="info #{@dir}">
  <h2>#{@title}</h2>
  <div>
    <div class="text">
      #{content}
    </div>

    <div class="img-wrapper video">
      <img class='placeholder' src="/img/desktop-video.png"/>
      <div class='computer-screen-overlay'>
        <img id='video-play-button'
             class='play-button'
             src='/img/icons/play-button.png'
             data-video-id='#{@video_id}'/>
      </div>
    </div>
  </div>
</section>
EOS
    end
  end
end

Liquid::Template.register_tag("videosection", Jekyll::VideoSectionBlock)
